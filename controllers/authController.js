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