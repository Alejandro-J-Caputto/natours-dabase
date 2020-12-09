const {
  getUser,
  createUser,
  editUser,
  deleteUser,
} = require('../controllers/userController');
const express = require('express');
// const app = express();
const router = express.Router();

router.route('/').get(getUser).post(createUser);

router.route('/:id').patch(editUser).delete(deleteUser);

// app.use('/api/v1/users', userRouter) // nos llevamos este paso al app.js
module.exports = router;
