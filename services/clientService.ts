import axios from 'axios';
import { configFile } from 'config';

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
    console.log(clientData, '/////ClientDATA');
    const allowedKeys = [
      'clientName',
      'companyName',
      'clientNo',
      'phoneNumber',
      'gstNumber',
      'site',
      'branch',
      'address',
      'location',
      'latitude',
      'longitude',
      'status',
      'checkIn',
      'lunch_time',
      'check_out',
    ];

    const payload: Record<string, any> = {};

    for (const key of allowedKeys) {
      if (clientData[key as keyof typeof clientData].length > 1) {
        payload[key] = clientData[key as keyof typeof clientData];
      }
    }

    try {
      const url = configFile.api.superAdmin.addClient();
      console.log(payload, '////payload////', url);
      const response = await axios.post(`${url}`, payload);
      console.log(response, '///Res');
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
      console.log(clientNo, '/////ClientnNOOOo');
      const response = await axios.delete(`${BASE_URL}/clients/by-client-no/${clientNo}`);
      return response.data;
    } catch (error) {
      console.log(error, '//ERROR');
      // console.log(error.response, '//////?/Res');
      throw error;
    }
  },
};
