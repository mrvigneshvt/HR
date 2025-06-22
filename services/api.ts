import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sdce.lyzooapp.co.in:31313/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Assign Work API
export const assignWork = async (data: {
  employeeId: string;
  companyNumber: string;
  fromDate: string;
  toDate: string;
}) => {
  try {
    const response = await api.post('/attendance/assignWork', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;