const {
  getUser,
  createUser,
  editUser,
  deleteUser,
} = require('../controllers/userController');
const { singUp, login, forgetPassword, resetPassword} = require('../controllers/authController')
const express = require('express');

// const app = express();
const router = express.Router();

router.post('/signup', singUp);
router.post('/login', login);

router.post('/forgotPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);


router.route('/').get(getUser).post(createUser);

router.route('/:id').patch(editUser).delete(deleteUser);

// app.use('/api/v1/users', userRouter) // nos llevamos este paso al app.js
module.exports = router;
