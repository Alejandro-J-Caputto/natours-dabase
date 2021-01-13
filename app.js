//CORE MODULES
//EXTERN MODULES
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

//CYBERSECURITY
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
//ERROR HANDLING
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
//END ERROR HANDLING 

//ROUTERS
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
//Express
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//SERVES STATICS FILES 
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));


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
app.use(cookieParser());
//DATA SANITIZATION AGAINST NoSQL query injection
app.use(mongoSanitize());
//DATA SANITIZATION AGAINST CROSS SITING ATTACKS XXS 
app.use(xss());
//PREVENT PARAMETER POLLUTION en este caso con duracion. 
app.use(hpp({
  whitelist: [
    'duration',
    'ratingsAverage',
    'maxGroupSize',
    'ratingsQuantity',
    'price',
    'difficulty'
  ]
}));



//TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});
// app.use(require('./routes/tourRoutes'))// middleware para recoger las rutas centralizadas
// app.use(require('./routes/userRoutes'))// middleware para recoger las rutas centralizadas



//ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
