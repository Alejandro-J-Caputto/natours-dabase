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
// const app = express();
const authController = require('../controllers/authController')




const router = express.Router();




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
