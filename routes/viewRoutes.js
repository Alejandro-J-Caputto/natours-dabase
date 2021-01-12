const express = require('express');
const viewController = require('../controllers/viewController')
const router = express.Router();

//ROUTES VIEWS FOR PUG ENGINE 
  router.get('/', viewController.getOverview)
  
  router.get('/tour/:slug', viewController.getDetails)



module.exports = router;