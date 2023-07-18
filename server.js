const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./models/tourModel');

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION! Shutting Down');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');
const DB =
  'mongodb+srv://vedant:uIxntgF4QrbBuMWP@cluster0.jdwkzig.mongodb.net/natours?retryWrites=true&w=majority';
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log('Connected to DB');
  });

// const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours.json'));
// const del = async (req, res) => {
//   await Tour.create(tours);
//   console.log('INserted');
// };
// del();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting Down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
