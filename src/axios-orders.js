import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-my-buger-39b2c.firebaseio.com'
});

export default instance;
