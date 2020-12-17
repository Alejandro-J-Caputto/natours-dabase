const express = require('express');
const {getReview, createReview, deleteReview} = require('../controllers/reviewController')
const authController = require('../controllers/authController')


const router = express.Router({mergeParams: true});



router.route('/')
    .get(getReview)
    .post(authController.protect, authController.restrictTo('user'), createReview)

router.route('/:id').delete(deleteReview);


module.exports = router