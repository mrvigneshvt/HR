import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sdce.lyzooapp.co.in:31313/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;