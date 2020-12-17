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





// router.param('id', checkId);
router.route('/').get(authController.protect, getAllTours).post(postTour);
router.route('/top-five-tours').get(topFiveTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router
  .route('/:id')
  .get(getTourByID)
  .put(editTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), deleteTour)
  .patch(patchTour);
  



// app.use('/api/v1/tours', tourRouter) //nos llevamos este paso al app.js
module.exports = router;
