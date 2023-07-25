import axios from 'axios';

export const postReview = async (review, rating, tour, user) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/reviews',
      data: {
        review,
        rating,
        tour,
        user,
      },
    });
    if (res.data.status === 'success') {
      alert('Review posted successfully');
    }
  } catch (err) {
    alert(err.body.message);
    console.log(err);
  }
};
