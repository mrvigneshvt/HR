import axios from 'axios';

const BASE_URL = 'https://sdce.lyzooapp.co.in:31313/api';

export interface Client {
  id?: number;
  clientName: string;
  companyName: string;
  companyNumber?: string;
  phoneNumber: string;
  gstNumber: string;
  site: string;
  branch: string;
  address: string;
  location: string;
  latitude: string;
  longitude: string;
  status: 'Active' | 'Inactive';
  checkIn: string;
  lunch_time: string;
  check_out: string;
}

export const clientService = {
  // Get all clients
  getAllClients: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/clients`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add new client
  addClient: async (clientData: Omit<Client, 'id'>) => {
    try {
      const response = await axios.post(`${BASE_URL}/clients`, clientData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update client
  updateClient: async (id: number, clientData: Omit<Client, 'id'>) => {
    try {
      const response = await axios.put(`${BASE_URL}/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete client
  deleteClient: async (id: number) => {
    try {
      const response = await axios.delete(`${BASE_URL}/clients/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 