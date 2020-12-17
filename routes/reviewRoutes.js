const express = require('express');
const {getReview, createReview, deleteReview, patchReview, setTourUserId} = require('../controllers/reviewController')
const authController = require('../controllers/authController');
const { getOne } = require('../controllers/handler-factory');


const router = express.Router({mergeParams: true});



router.route('/')
    .get(getReview)
    .post(authController.protect, authController.restrictTo('user'), setTourUserId ,createReview)

router.route('/:id')
    .delete(deleteReview)
    .patch(patchReview)
    .get(getOne);


module.exports = router