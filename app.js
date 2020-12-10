//CORE MODULES
//EXTERN MODULES
const express = require('express');
const morgan = require('morgan');
//ERROR HANDLING
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
//END ERROR HANDLING 

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
//Express
const app = express();

//middlewares
// console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json()); // modifica la data que viene
app.use(express.static(`${__dirname}/public`));




app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
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
