const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

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


exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  
    if(!document) {
      return next(new AppError(`No document found with that ID`, 404))
    }
  
    res.status(200).json({
      status: 'success',
      data: {
          data: document,
      } 
    });
  }) ;


  exports.createOne = Model => 
   catchAsync(async (req, res, next) => {

    const document = await Model.create(req.body);

    
    if(!document) {
      return next(new AppError(`No tour found with that ID`, 404))
    }
    res.status(201).json({
      status: 'success',
      data: {
        data: document
      },
    });

});

exports.getOne = (Model, popOptions) => 
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if(popOptions) query = query.populate(popOptions);

    const document = await query;

    if(!document) {
      return next(new AppError(`No document found with that ID`, 404))
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour: document,
      },
    });
})

exports.getAll = Model => catchAsync(async (req, res, next) => {

    let filter = {};
    if(req.params.tourId) filter = {tour: req.params.tourId}
    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitsFields()
      .paginate();
    console.log('bye bye');
    // const document = await features.query.explain();
    const document = await features.query;
    if (document.length === 0) {
      res.status(400).json({
        status: 'fail',
        message: 'No se ha encontrado ningun resultado',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      count: document.length,
      data: {
        data: document,
      },
    });
});
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