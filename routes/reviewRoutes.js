const express = require('express');
const {getReview, createReview, deleteReview, patchReview, setTourUserId} = require('../controllers/reviewController')
const authController = require('../controllers/authController');
const { getOne } = require('../controllers/handler-factory');


const router = express.Router({mergeParams: true});

router.use(authController.protect);


router.route('/')
    .get(getReview)
    .post(authController.restrictTo('user'), setTourUserId ,createReview)

router.route('/:id')
    .delete(authController.restrictTo('user', 'admin'),deleteReview)
    .patch(authController.restrictTo('user', 'admin'), patchReview)
    .get( getOne);


module.exports = router


