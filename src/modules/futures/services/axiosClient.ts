import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://api.binance.com/api/v3',
  timeout: 10000,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.msg || error.message || 'Unknown error';
    console.error('REST API Error:', message);
    return Promise.reject(error);
  }
);

export default axiosClient;
