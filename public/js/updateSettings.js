import axios from 'axios';

// type is either 'passwor' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      alert(`${type} updated successfully`);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};
