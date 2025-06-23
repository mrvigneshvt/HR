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
  check_in: string;
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
    // Map payload to new API keys
    const payload = {
      clientName: clientData.clientName,
      companyName: clientData.companyName,
      phoneNumber: clientData.phoneNumber,
      gstNumber: clientData.gstNumber,
      site: clientData.site,
      branch: clientData.branch,
      address: clientData.address,
      latitude: clientData.latitude,
      longitude: clientData.longitude,
      status: clientData.status,
      checkIn: clientData.check_in,
      lunchTime: clientData.lunch_time, // map from lunch_time
      checkOut: clientData.check_out,   // map from check_out
      clientNo: clientData.companyNumber, // map from companyNumber
    };
    console.log(payload,"payload")
    

    try {
      const response = await axios.post(`https://sdceweb.lyzooapp.co.in:31313/api/clients`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update client
  updateClient: async (id: number, clientData: Omit<Client, 'id'>) => {
    // Map payload to new API keys
    const payload = {
      clientName: clientData.clientName,
      companyName: clientData.companyName,
      phoneNumber: clientData.phoneNumber,
      gstNumber: clientData.gstNumber,
      site: clientData.site,
      branch: clientData.branch,
      address: clientData.address,
      latitude: clientData.latitude,
      longitude: clientData.longitude,
      status: clientData.status,
      checkIn: clientData.check_in,
      lunchTime: clientData.lunch_time, // map from lunch_time
      checkOut: clientData.check_out,   // map from check_out
      clientNo: clientData.companyNumber, // map from companyNumber
    };
    try {
      const response = await axios.put(`${BASE_URL}/clients/${id}`, payload);
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