
const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handler-factory');




exports.getReview = factory.getAll(Review);



exports.setTourUserId = (req, res, next) => {
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;
    next()
}
exports.getRevieId = factory.getOne(Review);

exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.patchReview = factory.updateOne(Review);

// exports.getReview = catchAsync( async (req, res ,next) => {
//     let filter = {};
//     if(req.params.tourId) filter = {tour: req.params.tourId}
//     const allReviews = await Review.find(filter)

//     if(!allReviews) {
//         return next(new AppError('There was a problem', 404));
//     }
//     res.status(200).json({
//         status: 'success',
//         results: allReviews.length,
//         data: allReviews
//     })
// })


// exports.createReview = catchAsync( async (req, res, next) => {

//     //allow nested routes
//     if(!req.body.tour) req.body.tour = req.params.tourId;
//     if(!req.body.user) req.body.user = req.user.id;
//     ///////
//     const newReview = await Review.create(req.body);
//     if(!newReview) {
//         return next(new AppError('There was a problem with the operation', 400));
//     }
//     res.status(201).json({
//         status: 'success',
//         data: {
//             review: newReview
//         }
//     })

// })
