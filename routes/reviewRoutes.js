const express = require('express');
const {getReview, createReview} = require('../controllers/reviewController')
const authController = require('../controllers/authController')


const router = express.Router();



router.route('/').get(getReview).post(authController.protect, authController.restrictTo('user'), createReview)



module.exports = router