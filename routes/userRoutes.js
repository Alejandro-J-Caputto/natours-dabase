const {
  getUser,
  createUser,
  editUser,
  deleteMe,
  updateMe,
  deleteUser,
  patchUser,
  getAllUsers,
  getUserById,
  uploadUserPhoto,
  resizeUserPhoto


} = require('../controllers/userController');
const { singUp, login,logOut, forgetPassword, resetPassword, updatePassword, protect, restrictTo} = require('../controllers/authController')


const express = require('express');



// const app = express();
const router = express.Router();

//AUTHORIZATION
router.get('/logout', logOut);
router.post('/signup', singUp);
router.post('/login', login);
router.post('/forgotPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);

//////
router.patch('/resetMyPassword',protect, updatePassword);
//NORMAL USER FUNCIONALITIES
router.route('/').get(protect, restrictTo('admin'), getAllUsers).post(createUser);
// router.route('/:id').patch(editUser).delete(deleteMe);
router.patch('/updateMe',protect, uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteMe',protect, deleteMe);
router.patch('/:id',protect, patchUser);
router.delete('/:id',protect, deleteUser);
router.get('/:id',protect, getUserById)


// app.use('/api/v1/users', userRouter) // nos llevamos este paso al app.js
module.exports = router;
