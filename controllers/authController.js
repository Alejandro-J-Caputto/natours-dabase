const {promisify} = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');



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

    const token = signToken(newUser._id);

    newUser.password = '=)'
   
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }      
    })
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
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
}); 



exports.protect = catchAsync(async (req,res,next)=> {
    let token;
    //1) Getting the token and check if its there
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        const tokenHeader = req.headers.authorization;
        token = tokenHeader.split(' ')[1];
    }
    if(!token) {
        return next(new AppError('Your are not logged in! Please logged in to get access', 401))
    }
    //2) Verification token 
   const decodedData = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
   console.log(decodedData);  
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
    await user.save({ validateBeforeSave: false });

    //3) Send it to user's email
}) 

exports.resetPassword = (req, res, next) => {

}