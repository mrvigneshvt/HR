import axios from 'axios';

const BASE_URL = 'https://sdce.lyzooapp.co.in:31313/api';

export interface UniformRequest {
  empId: string;
  name: string;
  designation: string;
  site: string;
  location: string;
  gender: 'Male' | 'Female';
  status: 'Active' | 'Inactive';
  shirtSize: string;
  pantSize: string;
  shoeSize: string;
  chuditharSize: string;
  femaleShoeSize: string;
  accessories: string[];
  femaleAccessories: string[];
  requestedDate: string;
  flab: string;
}

export interface LeaveRequest {
  employeeId: string;
  employeeName: string;
  leaveType: 'Sick' | 'Vacation' | 'Casual' | 'Maternity' | 'Other';
  startDate: Date;
  endDate: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy: string;
  numberOfDays: number;
}

export const requestsService = {
  // Uniform Requests
  async getUniformRequests() {
    const response = await axios.get(`${BASE_URL}/uniforms`);
    return response.data;
  },

  async addUniformRequest(request: UniformRequest) {
    console.log(request,"request")
    const response = await axios.post(`${BASE_URL}/uniforms`, request);
    return response.data;
  },

  async updateUniformRequest(id: string, request: UniformRequest) {
    const response = await axios.put(`${BASE_URL}/uniforms/${id}`, request);
    return response.data;
  },

  async deleteUniformRequest(id: string) {
    const response = await axios.delete(`${BASE_URL}/uniforms/${id}`);
    return response.data;
  },

  // Leave Requests
  async getLeaveRequests() {
    const response = await axios.get(`${BASE_URL}/Leaves`);
    return response.data;
  },

  async addLeaveRequest(request: LeaveRequest) {
    const response = await axios.post(`${BASE_URL}/Leaves`, request);
    return response.data;
  },

  async updateLeaveRequest(id: string, request: LeaveRequest) {
    const response = await axios.put(`${BASE_URL}/Leaves/${id}`, request);
    return response.data;
  },

  async deleteLeaveRequest(id: string) {
    const response = await axios.delete(`${BASE_URL}/Leaves/${id}`);
    return response.data;
  }
}; 