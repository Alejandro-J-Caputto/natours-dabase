const mongoose = require('mongoose');
const dotenv = require('dotenv');
//FALLBACK UNCAUGHT

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION');
  process.exit(1);
})


dotenv.config({ path: './config.env' });
// console.log(process.env.DATABASE)
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const app = require('./app');

mongoose
  .connect(DB, {
    // .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log(con.connections);
    console.log(`DB CONNECTIONS WORKS`);
  })
  .catch((err) => console.log(`hubo un ${err}`));
// console.log(process.env)

const port = process.env.PORT || 3000;
// console.log(process.env.PORT)
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});


//FALLBACKS SAFETYNETS
process.on('unhandledRejection', err => {
  console.log(err.name, err.message)
  console.log('UNHANDLED REJECTION')
  server.close(()=> {
    process.exit(1);
  })
})





