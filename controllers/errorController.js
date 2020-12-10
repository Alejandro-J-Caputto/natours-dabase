const { format } = require('morgan');
const AppError = require('../utils/appError');

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
  const message = `The name field already exists ${repeatedValue}`

  return new AppError(message, 400);

}

const handleValidationErrorDB = (error, body) => {
  console.log(error.errors.ratingsAverage.properties.message)

  const errors = body.map(el => error.errors[el].properties.message);
  console.log(errors)

  const message = 'Invalid input data.' + errors.join('. ');
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
  console.log(req.body)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
     sendErrorDev(err, res);
    

    } else if (process.env.NODE_ENV === 'production'){
      let error = {...err};
  
      console.log(typeof err)
      if(error.status === 500 || error.kind === 'ObjectId') error = handleCastErrorDB(error)
      
      if(error.code === 11000) error = handleDuplicateFieldsDB(error, req.body.name);
      
      const checkForValidatorError = Object.keys(req.body);
      console.log(checkForValidatorError[0])
      if( error.errors[checkForValidatorError[0]].name === 'ValidatorError') error = handleValidationErrorDB (error, checkForValidatorError) 
      sendErrorProd(error, res)
    }

  
  }