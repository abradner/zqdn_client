import axios from 'axios';

const baseURL =  'http://localhost:3000'; // process.env.REACT_APP_API_BASE_URL

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;