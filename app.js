//CORE MODULES
//EXTERN MODULES
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
//ERROR HANDLING
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
//END ERROR HANDLING 

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
//Express
const app = express();

//MIDDLEWARE STACK
//SECURITY HTTP HEADERS
app.use(helmet())

//DEVELOPING LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


//LIMIT REQUEST FROM SAME API
const limiter = rateLimit({
  max: 100,
  windowMiliseconds: 60 * 60 * 1000,
  message: 'Too many request from this ip, please try again in an hour' 
})
app.use('/api' , limiter);
//BODY PARSER READING DATA FROM BODZ INTO REQ.body
app.use(express.json({limit: '10kb' })); // modifica la data que viene
//SERVES STATICS FILES 
app.use(express.static(`${__dirname}/public`));

//TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers.authorization);
  next();
});
// app.use(require('./routes/tourRoutes'))// middleware para recoger las rutas centralizadas
// app.use(require('./routes/userRoutes'))// middleware para recoger las rutas centralizadas
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//MANEJO DE RUTAS

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl}`
  // })
  // const err = new Error(`Can't find ${req.originalUrl}`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl}`, 404));
})

app.use(globalErrorHandler)


module.exports = app;

// Podemos definir nuestro puerto

//

//Servidor
// app.listen(port, () => {
//     console.log(`App running on port ${port}`)
// });
