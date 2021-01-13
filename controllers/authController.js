const {promisify} = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const createAndSendToken= (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions =  {
        expires: new Date(Date.now()
        + process.env.JWT_COOKIE_EXPIRES_IN
        * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt-cookie', token, cookieOptions)

    user.password = undefined;

    res.status(statusCode).json({
    status: 'success',
    token,
    data: {
        user
    }
})
}

const signToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.singUp = catchAsync(async ( req, res, next ) => {

    const body = req.body;

    const newUser = await User.create({
        name: body.name,
        email: body.email,
        password: body.password,
        passwordConfirm: body.passwordConfirm
    });

    newUser.password = '=)'
    createAndSendToken(newUser, 201, res);

    // const token = signToken(newUser._id);

   
    // res.status(201).json({
    //     status: 'success',
    //     token,
    //     data: {
    //         user: newUser
    //     }      
    // })
});


exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    //1. Check if email and password exists
    if (!email || !password ) {
        return next(new AppError('The Password or Email are not correct'), 400)
    }
    //2. Check if user exists && password is correct 
    const user = await User.findOne({email: email}).select('+password');
    // const correct = await user.correctPassword(password, user.password)

    if(!user || !(await user.correctPassword(password, user.password))) {
        
        return next (new AppError('There is not an user with the provided email or the password is not correct', 401));
    }

    //3) If everything ok, send token to client. 

    createAndSendToken(user, 200, res);

    // const token = signToken(user._id);
    // res.status(200).json({
    //     status: 'success',
    //     token
    // })
}); 



exports.protect = catchAsync(async (req,res,next)=> {

    let token;
    //1) Getting the token and check if its there
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        const tokenHeader = req.headers.authorization;
        token = tokenHeader.split(' ')[1];
    } else if (req.cookies['jwt-cookie']) {
        token = req.cookies['jwt-cookie']
    }
    if(!token) {
        return next(new AppError('Your are not logged in! Please logged in to get access', 401))
    }
    //2) Verification token 
   const decodedData = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//    console.log(decodedData);  
    //3) Check if user still exists
    const freshUser = await User.findById(decodedData.id);
    if(!freshUser) {
        return next( new AppError('The user belonging to this token does not longer exits', 401))
    }
    //4) Check if user chagend password after the token was issued
    if(freshUser.changedPasswordAfter(decodedData.iat)) {
        return next(new AppError('User recently changed password! Please log in aggin', 401));
    }
    //ACCESS CHECK 
    req.user = freshUser; // el usuario estara disponible por referencia en req.user en el siguiente midleware auth
    // console.log(req.user, 'patata')
    res.locals.user = freshUser
    next();
})

// ONLY FOR VIEW RENDER PAGES
exports.isLoggedIn = catchAsync(async (req,res,next)=> {
    if (req.cookies['jwt-cookie']) {
        const decodedData = await promisify(jwt.verify)(req.cookies['jwt-cookie'],
        process.env.JWT_SECRET);
        //    console.log(decodedData);  
        //3) Check if user still exists
        const freshUser = await User.findById(decodedData.id);
        if(!freshUser) {
            return next()
        }
        //4) Check if user chagend password after the token was issued
        if(freshUser.changedPasswordAfter(decodedData.iat)) {
            return next();
        }
        //THERE IS A LOGGED IN USER
        res.locals.user = freshUser
        return next();
    }
    next();
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next( new AppError(' You dont have permissions', 403))
        }
        next();
    }
} 

exports.forgetPassword = catchAsync(async(req, res ,next) => {
    //1) Get user based on POSTED email
    const user = await User.findOne({email: req.body.email});
    if(!user) {
        return next(new AppError('There is no user with that email addres.', 404));
    }

    //2) Generate tje random reset token //metodo en el modelo 
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); //{ validateBeforeSave: false } para que no salten las validaciones que tienen el email y la password

    //3) Send it to user's email
    const resetURL  = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a patch request eith your new password & passwordConfirm to the reset URL => ${resetURL}`
    try {
        await sendEmail ({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message: message,
        text: message
    })

        res.status(200).json({
        status: 'success',
        message: 'Token sent to email'
    })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false }); //{ validateBeforeSave: false } para que no salten las validaciones que tienen el email y la password
        return next(new AppError('There was an error sendint the email try again later'), 500);
    }
   
}) 

exports.resetPassword = catchAsync(async (req, res, next) => {

//1 ) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({passwordResetToken: hashedToken,
         passwordResetExpires: {$gt: Date.now()}});

//2 ) if token has not expired, and there is user, set the new password
    if(!user) {
        return next( new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

//3 ) Update changedPasswordAt proerty for the user
    await user.save();

//4 ) Log the user in, send the JWT
createAndSendToken(user, 200, res);

// const token = signToken(user._id);
// res.status(200).json({
//     status: 'success',
//     token
// })

}); 

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) get user 

    // console.log(req.user.id  ,'patata')
    const user = await User.findById(req.user.id).select('+password');
    // console.log(user)
    // 2) Check if the coming pass is correct

    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next( new AppError('Your current password is wrong.', 401));
    }

    user.password = req.body.password,
    user.passwordConfirm = req.body.passwordConfirm,
    // 3) Update the password
    await user.save();
    

    // 4) Log user in, send JWT
createAndSendToken(user, 200, res);

    // const token = signToken(user._id);
    // res.status(200).json({
    // status: 'success',
    // token
// })
}) 