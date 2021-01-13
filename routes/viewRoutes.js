const express = require('express');
const viewController = require('../controllers/viewController')
const authController = require('../controllers/authController')
const router = express.Router();

//ROUTES VIEWS FOR PUG ENGINE 
  router.use(authController.isLoggedIn);

  router.get('/', viewController.getOverview)
  
  router.get('/tour/:slug', viewController.getDetails)

  //LOGIN ROUTE
  router.get('/login', viewController.loginUser)

  //ACCOUNT
  // router.get('/me', authController.protect, viewController.getAccount)
module.exports = router;