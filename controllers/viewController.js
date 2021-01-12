const Tour = require('../models/tourModel');

const catchAsync = require('../utils/catchAsync');


exports.getOverview = catchAsync(async(req,res, next) => {

    //1)Get Our Data 
    const tours = await Tour.find();
    //2)Build Template

    //3)Render Template using data from step 1) 

    res.status(200).render('overview', {
        tours
    })
  }) 


  exports.getTourOverview = (req,res) => {
    res.status(200).render('tour', {
      title: 'The Forest Hiker Tour'
    })
  }

  exports.getDetails = catchAsync(async(req,res,next) => {

    const tour = await Tour.findOne({slug: req.params.slug}).populate({
      path:'reviews',
      fields: 'review rating user'
    })
    
    res.status(200).render('tour', {
      tour
    })
  })