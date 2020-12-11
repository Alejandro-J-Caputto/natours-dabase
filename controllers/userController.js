// const fs = require('fs')

// const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`));

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


exports.getUser = catchAsync(async (req, res, next) => {
    const users = await User.find({})

    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    })
});
exports.createUser = (req, res) => {


};

exports.editUser = (req, res) => {

};

exports.deleteUser = (req, res) => {

};