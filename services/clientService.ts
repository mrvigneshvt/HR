import axios from 'axios';

const BASE_URL = 'https://sdceweb.lyzooapp.co.in:31313/api';

export interface Client {
  id?: number;
  clientName: string;
  companyName: string;
  clientNo: string;
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
    const payload = {
      clientName: clientData.clientName,
      companyName: clientData.companyName,
      clientNo: clientData.clientNo,
      phoneNumber: clientData.phoneNumber,
      gstNumber: clientData.gstNumber,
      site: clientData.site,
      branch: clientData.branch,
      address: clientData.address,
      location: clientData.location,
      latitude: clientData.latitude,
      longitude: clientData.longitude,
      status: clientData.status,
      checkIn: clientData.checkIn,
      lunch_time: clientData.lunch_time,
      check_out: clientData.check_out,
    };
    try {
      const response = await axios.post(`${BASE_URL}/clients`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update client
  updateClient: async (clientNo: string, clientData: Partial<Client>) => {
    // Only required fields for update, but allow extra fields if provided
    const payload: any = {
      clientName: clientData.clientName,
      companyName: clientData.companyName,
      phoneNumber: clientData.phoneNumber,
      site: clientData.site,
      branch: clientData.branch,
      address: clientData.address,
    };
    // Optionally add other fields if present
    if (clientData.gstNumber) payload.gstNumber = clientData.gstNumber;
    if (clientData.location) payload.location = clientData.location;
    if (clientData.latitude) payload.latitude = clientData.latitude;
    if (clientData.longitude) payload.longitude = clientData.longitude;
    if (clientData.status) payload.status = clientData.status;
    if (clientData.checkIn) payload.checkIn = clientData.checkIn;
    if (clientData.lunch_time) payload.lunch_time = clientData.lunch_time;
    if (clientData.check_out) payload.check_out = clientData.check_out;

    try {
      const response = await axios.put(`${BASE_URL}/clients/by-client-no/${clientNo}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete client
  deleteClient: async (clientNo: string) => {
    try {
      const response = await axios.delete(`${BASE_URL}/clients/by-client-no/${clientNo}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}; 