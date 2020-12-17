const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.deleteOne = Model => { 
    return catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if(!document){
      return next(new AppError('Not able to delete the document', 404))
    }
    res.status(200).json({
      status: 'success',
      document: null,
    });
});
}
// exports.deleteTour = catchAsync(async (req, res, next) => {


//     const delTour = await Tour.findByIdAndDelete(req.params.id);
//     if(!delTour){
//       return next(new AppError('Not able to delete', 404))
//     }
//     res.status(200).json({
//       status: 'success',
//       tour: delTour,
//     });

//     // res.status(400).json({
//     //   status: 'fail',
//     //   tour: err,
//     // });

// })