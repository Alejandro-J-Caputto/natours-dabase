const express = require('express');
const viewController = require('../controllers/viewController')
const authController = require('../controllers/authController')
const router = express.Router();

//ROUTES VIEWS FOR PUG ENGINE 
  // router.use(authController.isLoggedIn);

  router.get('/',authController.isLoggedIn, viewController.getOverview)
  
  router.get('/tour/:slug',authController.isLoggedIn, viewController.getDetails)

  //LOGIN ROUTE
  router.get('/login',authController.isLoggedIn, viewController.loginUser)

  //ACCOUNT
  router.get('/me', authController.protect, viewController.getAccount)
module.exports = router;