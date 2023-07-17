const AppError = require('../utils/appError');
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate Field value: ${err.keyValue.name}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTErr = (err) => {
  return new AppError('Invalid Token Please login again', 401);
};

const handleJWTExpiredError = (err) => {
  return new AppError('Token has expired. Please login again', 401);
};

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      err,
    });
  } else {
    // RENDERED WEBSITE
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } //everything that is not marked operational
    else {
      console.error('💥 Error! 💥', err);
      res.status(err.statusCode).json({
        //status code is always 500
        status: err.status, //status is always "error"
        message: "There was an error, it's a problem from the server side! :(",
      });
    }
  } else {
    // RENDERED
    if (err.isOperational) {
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message,
      });
    } //everything that is not marked operational
    else {
      console.error('💥 Error! 💥', err);
      res.status(err.statusCode).render('error',{
        //status code is always 500
        title: 'Something went wrong', //status is always "error"
        msg: "Please try again later",
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //500 because of mongoose or something else. (unknown)
  err.status = err.status || 'error';
  if (process.env.NODE_ENV == 'development') sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV == 'production') {
    let error = Object.create(err);
    if (err.name == 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTErr(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);
    sendErrorProd(error, req, res);
  }
};
