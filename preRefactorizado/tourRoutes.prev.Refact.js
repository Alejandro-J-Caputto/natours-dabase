const express = require('express');
const {
  getAllTours,
  getTourByID,
  postTour,
  deleteTour,
  editTour,
  patchTour,
  checkId,
  checkBodyTour,
} = require('../controllers/tourController');
// const app = express();
const router = express.Router();
router.param('id', checkId);

router.route('/').get(getAllTours).post(checkBodyTour, postTour);
router
  .route('/:id')
  .get(getTourByID)
  .put(editTour)
  .delete(deleteTour)
  .patch(patchTour);
// app.use('/api/v1/tours', tourRouter) //nos llevamos este paso al app.js
module.exports = router;
