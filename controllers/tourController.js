const Tour = require('../models/tourModel');
// const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handler-factory');

//SOME MIDDLEWARE
exports.topFiveTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage, price';
  req.query.fields =
    'ratingsAverage, name, difficulty, price, duration, summay, description';
  next();
};


exports.getAllTours = factory.getAll(Tour);
exports.getTourByID = factory.getOne(Tour, {path: 'reviews'})
exports.postTour = factory.createOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.patchTour = factory.updateOne(Tour);


//GEOLOCATION
exports.getToursWithinRadius = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  console.log(distance, latlng, unit)
  const [lat, lng] = latlng.split(',');
  
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if(!lat || !lng) {
    return next( new AppError('Please provide latitude and longitude in the format lat,lang.', 400))
  }

  const tours = await Tour.find({startLocation: {
    $geoWithin: {
       $centerSphere: [[lng, lat],radius] 
      }
    }
  });

  console.log(distance,lat,lng,unit);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  })
}) 


exports.getDistances = catchAsync(async (req,res,next) => {
  const {  latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001
  if(!lat || !lng) {
    return next( new AppError('Please provide latitude and longitude in the format lat,lang.', 400))
  }

  const distance = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1 , lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      },
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ])
  res.status(200).json({
    status: 'success',
    results: distance.length,
    data: {
      data: distance
    }
  })
})
/////////////


// exports.getAllTours = catchAsync(async (req, res, next) => {

//   // EXECUTE QUERY
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitsFields()
//     .paginate();
//   console.log('bye bye');
//   const allTours = await features.query;
//   if (allTours.length === 0) {
//     res.status(400).json({
//       status: 'fail',
//       message: 'No se ha encontrado ningun resultado',
//     });
//     return;
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       data: allTours,
//     },
//   });
// });
// exports.getTourByID = catchAsync(async (req, res, next) => {

//     const { id } = req.params;
//     console.log(id);

//     const oneTour = await Tour.findById(id).populate('reviews');
//     if(!oneTour) {
//       return next(new AppError(`No tour found with that ID`, 404))
//     }
//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour: oneTour,
//       },
//     });

// });


// exports.postTour = catchAsync(async (req, res, next) => {
  
  //     const newTour = await Tour.create(req.body);
  
  
  //     if(!newTour) {
    //       return next(new AppError(`No tour found with that ID`, 404))
    //     }
    //     res.status(201).json({
      //       status: 'success',
      //       data: {
        //         tour: newTour
        //       },
        //     });
        
        // });

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

// }) ;
exports.editTour = async (req, res, next) => {
  console.log('works');
};

// exports.patchTour = catchAsync(async (req, res, next) => {
//   const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if(!updatedTour) {
//     return next(new AppError(`No tour found with that ID`, 404))
//   }

//   res.status(200).json({
//     status: 'success',
//     updated: updatedTour,
//   });
// }) ;
exports.checkBodyTour = (req, res, next) => {
  console.log('works');
};

exports.getTourStats = catchAsync(async (req, res, next) => {

    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      {
        $match: { _id: { $ne: 'easy' } },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });

    // res.status(400).json({
    //   status: 'fail',
    //   message: err,
    // });

}) ;

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {

    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numToursStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numberTourStarts: -1 },
      },
      {
        $limit: 6,
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });

    // res.status(400).json({
    //   status: 'fail',
    //   message: err,
    // });

}) ;
