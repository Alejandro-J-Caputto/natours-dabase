// const fs = require('fs')

// const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`));

const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handler-factory');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, callbackFunctionAsNext) => {
//         callbackFunctionAsNext(null, 'public/img/users');
//     },
//     filename: (req, file, callbackFunctionAsNext) => {
//         //user-id-timestamp.jpg
//         const ext = file.mimetype.split('/')[1];
//         callbackFunctionAsNext(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });
const multerStorage = multer.memoryStorage(); // esta almacenada en el buffer
const multerFilter = (req, file, callbackFunctionAsNext) => {
    if(file.mimetype.startsWith('image')) {
        callbackFunctionAsNext(null, true);
    } else {
        callbackFunctionAsNext(new AppError('Not an image! Please upload image only.', 400), false)
    }
}

const upload = multer(
    {
      storage: multerStorage,
      fileFilter: multerFilter  
    }
);

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = async (req,res,next) => {
    if ( !req.file) return next;

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/img/users/${req.file.filename}`)

    next();
}

const filterObj = (body, ...fields) => {
    const newObj = {}
    Object.keys(body).forEach(el => {
        if(fields.includes(el)) newObj[el] = body[el];
    });
    return newObj
}

// exports.getUser = catchAsync(async (req, res, next) => {
//     const users = await User.find({})

//     res.status(200).json({
//         status: 'success',
//         data: {
//             users
//         }
//     })
// });
exports.getAllUsers = factory.getAll(User);
exports.getUserById = factory.getOne(User);

// FOR ADMINS 
exports.deleteUser = factory.deleteOne(User);
// FOR ADMINS NO USAR PARA ACTUALIZAR PASSWORDS
exports.patchUser = factory.updateOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
    console.log(req.file);
    console.log(req.body);
    const filteredBody = filterObj(req.body, 'name', 'email');
    if(req.file) filteredBody.photo = req.file.filename;
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

