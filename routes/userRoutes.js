const {
  getUser,
  createUser,
  editUser,
  deleteMe,
  updateMe,
  deleteUser,

} = require('../controllers/userController');
const { singUp, login, forgetPassword, resetPassword, updatePassword, protect, restrictTo} = require('../controllers/authController')


const express = require('express');

// const app = express();
const router = express.Router();

//AUTHORIZATION
router.post('/signup', singUp);
router.post('/login', login);
router.post('/forgotPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/resetMyPassword',protect, updatePassword);
//NORMAL USER FUNCIONALITIES
router.route('/').get(getUser).post(createUser);
// router.route('/:id').patch(editUser).delete(deleteMe);
router.patch('/updateMe',protect, updateMe);
router.delete('/deleteMe',protect, deleteMe);
router.delete('/:id', deleteUser);



// app.use('/api/v1/users', userRouter) // nos llevamos este paso al app.js
module.exports = router;
