import axios from 'axios';
import { login } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { postReview } from './postReview';
// import { signup } from './login';
const loginForm = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const bookBtn = document.getElementById('book-tour');
const signupForm = document.querySelector('.form--signup');
const reviewForm = document.querySelector('.review--form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    //   console.log('Hello');
    login(email, password);
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // console.log(form);
    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').innerHTML = 'Updating....';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').innerHTML = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.innerHTML = 'Processing...';
    const tourId = e.target.dataset.tourId;
    bookTour(tourId);
  });
}

const signup = async (name, email, password, passwordConfirm) => {
  try {
    console.log(name, email);
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      alert('Signed in suceessfully. Welcome!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    alert(err.message);
    console.log(err);
  }
};

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    // console.log(name,email);
    signup(name, email, password, passwordConfirm);
  });
}

if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;
    const user = document.getElementById('post-review').dataset.userId;
    const tour = document.getElementById('post-review').dataset.tourId;
    postReview(review, rating, tour, user);
    document.getElementById('rating').value='';
    document.getElementById('review').value='';
  });
}
