
const AppError = require('../utils/appError');

const handleTokenError = err => {
  const message = err.message;
  return new AppError(message + ' Please log in', 400);
}
const handleTokenExpired = err => {
  const message = err.message;
  return new AppError(message + ' Please log in again', 401)
}

const handleCastErrorDB = (err) => {
  console.log('/////////////////////////////')
  const message = `Invalid ${err.path}: ${err.value}.`
  console.log(message)
  return new AppError(message, 400);
}

const handleDuplicateFieldsDB = (err, repeatedValue) => {
  // const valueError = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  // console.log(valueError)
  // const message = `Duplicate field value: ${valueError[0]}`
  console.log('///////////////////////')
  console.log(repeatedValue)
  const message = `The name field already exists ${repeatedValue}`

  return new AppError(message, 400);

}

const handleValidationErrorDB = (error, body) => {

  console.log(error)
  const errors = body.map(el => error.errors[el].properties.message);
  console.log(errors)

  const message = 'Invalid input data.' + errors.join('. ');
  return new AppError(message, 400);
}


const handleValidationErrorUserDB = ( error, input ) => {
   const errors = input.map(el => error.errors[el].properties.message);
   const message = 'Invalid input data.' + errors.join('. ')
   return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: {...err},
    message: err.message,
    stack: err.stack,
  })
}
const sendErrorProd = (err, res) => {
  //Operational error
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    //Programming or other errors. 
    console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    })

  }

}



module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
     sendErrorDev(err, res);
    

    } else if (process.env.NODE_ENV === 'production'){
      let error = {...err};
  
      console.log(typeof err)
      if(error.status === 500 || error.kind === 'ObjectId') error = handleCastErrorDB(error)
      
      if(error.code === 11000) {

        error = handleDuplicateFieldsDB(error, req.body.name);
        
      }

      if(error.name === "JsonWebTokenError") error = handleTokenError(error);
      if(error.name === "TokenExpiredError") error = handleTokenExpired(error);
      const checkForValidatorError = Object.keys(req.body); 
      if(error._message === "User validation failed") {

        const propertieErrors = Object.keys(error.errors);
        console.log(propertieErrors)

        error = handleValidationErrorUserDB(error, propertieErrors);
      }    

      if(error._message === "Validation failed" && error.errors[checkForValidatorError[0]].name && error.errors[checkForValidatorError[0]].name === 'ValidatorError') error = handleValidationErrorDB (error, checkForValidatorError) 
      sendErrorProd(error, res)
    }

  
  }