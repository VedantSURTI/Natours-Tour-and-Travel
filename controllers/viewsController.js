const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
exports.getOverview = catchAsync(async (req, res, next) => {
  //1 Get tour data
  const tours = await Tour.find();
  //2 Build template

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLogin = catchAsync(async (req, res, next) => {
  res
    .status(200)
    // .set(
    //   'Content-Security-Policy',
    //   "connect-src 'self' https://cdnjs.cloudflare.com"
    // )
    .render('login', {
      title: 'Log into your account',
    });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user,
  });
});

exports.getMyTours = async (req, res, next) => {
  // 1 Find the bookings
  const bookings = await Booking.find({ user: req.user.id });
  // 2 Find tours with the return ID's
  const tourIDs = bookings.map((el) => el.tour.id);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  // console.log(tours, tourIDs, bookings);
  res.status(200).render('overview', {
    title: 'My tours',
    tours,
  });
};

exports.getMyReviews = async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id });
  res.status(200).render('reviews', {
    title: 'Your Reviews',
    reviews,
  });
};

exports.getSignUp = (req, res) => {
  res.status(200).render('signup', {
    title: 'Signup Page',
  });
};
