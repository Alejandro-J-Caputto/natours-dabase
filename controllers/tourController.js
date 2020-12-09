const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
//SOME MIDDLEWARE
exports.topFiveTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage, price';
  req.query.fields =
    'ratingsAverage, name, difficulty, price, duration, summay, description';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitsFields()
      .paginate();
    console.log('bye bye');
    const allTours = await features.query;
    if (allTours.length === 0) {
      res.status(400).json({
        status: 'fail',
        message: 'No se ha encontrado ningun resultado',
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: allTours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.getTourByID = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const oneTour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      data: {
        tour: oneTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'No se ha encontrado el Tour',
    });
  }
};
exports.postTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    const delTour = await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      tour: delTour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      tour: err,
    });
  }
};
exports.editTour = async (req, res) => {
  console.log('works');
};
exports.patchTour = async (req, res) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    updated: updatedTour,
  });
};
exports.checkBodyTour = (req, res) => {
  console.log('works');
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
