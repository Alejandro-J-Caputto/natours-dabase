const express = require('express');
const {
  getAllTours,
  getTourByID,
  postTour,
  deleteTour,
  editTour,
  patchTour,
  topFiveTours,
  getTourStats,
  getMonthlyPlan,
  // checkId,
} = require('../controllers/tourController');
const reviewRouter = require('./reviewRoutes');

// const app = express();
const authController = require('../controllers/authController')




const router = express.Router();


//NESTED ROUTES
//POST /tour/1312123/reviews
//GET /tour/1312123/reviews
//GET /tour/1312123/reviews/2342348sdf

router.use('/:tourId/reviews', reviewRouter);


/////////////////////


// router.param('id', checkId);
router.route('/')
  .get(getAllTours)
  .post(authController.protect, postTour);
router.route('/top-five-tours')
  .get(topFiveTours);
router.route('/tour-stats')
  .get(getTourStats);
router.route('/monthly-plan/:year')
  .get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);
router
  .route('/:id')
    .get(getTourByID)
    .put(editTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), deleteTour)
    .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), patchTour);
  
  



// app.use('/api/v1/tours', tourRouter) //nos llevamos este paso al app.js
module.exports = router;
