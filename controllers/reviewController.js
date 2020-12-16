
const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');




exports.getReview = catchAsync( async (req, res ,next) => {

    const allReviews = await Review.find({})

    if(!allReviews) {
        return next(new AppError('There was a problem', 404));
    }
    res.status(200).json({
        status: 'success',
        results: allReviews.length,
        data: allReviews
    })
})

exports.createReview = catchAsync( async (req, res, next) => {

    const newReview = await Review.create(req.body);
    if(!newReview) {
        return next(new AppError('There was a problem with the operation', 400));
    }
    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    })

})