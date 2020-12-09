//CORE MODULES
//EXTERN MODULES
const express = require('express');
const morgan = require('morgan');
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
  console.log('hello from the middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// app.use(require('./routes/tourRoutes'))// middleware para recoger las rutas centralizadas
// app.use(require('./routes/userRoutes'))// middleware para recoger las rutas centralizadas
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

// Podemos definir nuestro puerto

//

//Servidor
// app.listen(port, () => {
//     console.log(`App running on port ${port}`)
// });
