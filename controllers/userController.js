// const fs = require('fs')

// const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`));

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handler-factory');


const filterObj = (body, ...fields) => {
    const newObj = {}
    Object.keys(body).forEach(el => {
        if(fields.includes(el)) newObj[el] = body[el];
    });
    return newObj
}

exports.getUser = catchAsync(async (req, res, next) => {
    const users = await User.find({})

    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    })
});

exports.updateMe = catchAsync(async (req, res, next) => {
    const filteredBody = filterObj(req.body, 'name', 'email');
    // 1) Create an error if he tries to update the password
    if( req.body.password || req.body.passwordConfirm) {
        return next( new AppError('You can not change the password from here, Please use the route useMyPassword', 400));
    }
    // 2) Update the user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true});
    
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
}) 


exports.createUser = (req, res) => {


};

exports.editUser = (req, res) => {

};

exports.deleteMe = catchAsync( async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false})
    res.status(204).json({
        status: 'success',
        data: null
    })
}) 


exports.deleteUser = factory.deleteOne(User);