import { configFile } from 'config';
import React from 'react';
import useState from 'react';
import axios from 'axios';
import { PopUpTypes } from '../app/index';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEmployeeStore } from 'Memory/Employee';
export class Api {
  public static async handleApi(options: {
    url: string;
    type: 'POST' | 'GET' | 'PUT' | 'DELETE';
    payload?: Record<string, any>;
  }): Promise<{ status: number; data: { data: Record<string, any> } }> {
    console.log('Handling API call..', options.url);
    switch (options.type) {
      case 'DELETE':
        try {
          const request = await axios.delete(options.url, options.payload);

          const { data, status } = request;

          return {
            status,
            data,
          };
        } catch (error: any) {
          const response = error.response;

          const { data, status } = response;

          return {
            status,
            data,
          };
        }

      case 'GET':
        try {
          const request = await axios.get(options.url);

          const { data, status } = request;

          return {
            status,
            data,
          };
        } catch (error: any) {
          const response = error.response;

          const { data, status } = response;

          return {
            status,
            data,
          };
        }

      case 'POST':
        try {
          const request = await axios.post(options.url, options.payload);

          const { data, status } = request;

          return {
            status,
            data,
          };
        } catch (error: any) {
          const response = error.response;

          const { data, status } = response;

          return {
            status,
            data,
          };
        }

      case 'PUT':
        try {
          const request = await axios.put(options.url, options.payload);

          const { data, status } = request;

          return {
            status,
            data,
          };
        } catch (error: any) {
          const response = error.response;

          const { data, status } = response;

          return {
            status,
            data,
          };
        }
    }
  }

  //   {
  // "empId":"SMF1",
  // "name":"mohinth",
  // "designation":"traveler",
  // "site":"chennai",
  // "location":"chennai",
  // "gender":"Male",      // ['Male', 'Female']
  // "status":"Active",    // ['Active', 'Inactive']
  // "shirtSize":"42",
  // "pantSize":"28",
  // "shoeSize":"11",
  // "chuditharSize":"",
  // "femaleShoeSize":"",
  // "accessories":[],
  // "femaleAccessories":[],
  // "requestedDate":"1/2/25",
  // "flab":""
  // }

  public static async postLeaveReq(options: {
    employeeId: string;
    employeeName: string;
    leaveType: 'Casual' | 'Sick' | 'Vacation' | 'Maternity' | 'Other';
    startDate: string;
    endDate: string; //'2/1/25';
    status: 'Pending';
  }) {
    try {
      console.log('received options data', options);

      const url = configFile.api.common.postLeaveReq();

      const api = await this.handleApi({
        url,
        type: 'POST',
        payload: {
          employeeId: options.employeeId,
          employeeName: options.employeeName,
          leaveType: options.leaveType,
          startDate: options.startDate,
          endDate: options.endDate, //'2/1/25';
          status: 'Pending',
        },
      });

      console.log(api, 'apiResssssssssssssssssssss');

      switch (api.status) {
        case 201:
          return { status: true, message: 'success' };

        case 400:
          return { status: false, message: api.data.message };

        case 500:
          return { status: false, message: api.data.message };
      }
    } catch (error) {
      console.log('error in leaveRequest', error);
      return { status: false, message: 'Error in Post Request' };
    }
  }

  public static async fetchPaySlip(options: {
    empId: string;
    month: string;
    year: string;
  }): Promise<Record<string, any> | 'error' | 'not-found' | 'invalid-format' | 'mapping'> {
    try {
      const url = configFile.api.common.getPaySlip(
        options.empId,
        `${options.year}-${options.month}`
      );

      console.log(url, 'urllCall');

      const api = await this.handleApi({ url, type: 'GET' });

      switch (api.status) {
        case 200:
          return api.data.data.payslips[0] ? api.data.data.payslips[0] : 'mapping';
        case 400:
          return 'invalid-format';

        case 404:
          return 'not-found';

        case 505:
          return 'error';
      }

      return 'error';
    } catch (error) {
      console.log(error);
      return 'error';
    }
  }
  public static async postUniReq(options: {
    empId: string;
    name: string;
    designation: string;
    site: string;
    location: string;
    gender: 'Male' | 'Female';
    status: 'Active';
    shirtSize: number;
    pantSize: number;
    shoeSize: number;
    chuditharSize: number;
    femaleShoeSize: number;
    accessories: [];
    femaleAccessories: [];
    requsedDate: string;

    // gender: 'Male' | 'Female';
    // empId: string;
    // site: string;
    // location: string;
    // status: 'Active'; // ['Active', 'Inactive']
    // shirtSize: number;
    // pantSize: number;
    // shoeSize: number;
    // chuditharSize: number;
    // femaleShoeSize: number;
    // accessories: [];
    // femaleAccessories: [];
    // requsedDate: '20/02/25';
  }) {
    try {
      const url = configFile.api.common.postUniformReq();

      console.log(options, 'optionsssssssssssss');
      const api = await this.handleApi({ url, type: 'POST', payload: options });

      console.log(api, '//////////////////////////////api');

      switch (api.status) {
        case 201:
          return { status: true, message: 'success' };
        case 400:
          return { status: false, message: api.data.message };
        case 500:
          return { status: false, message: api.data.message };
      }
    } catch (error) {
      console.log('postUniReq', error);
      return { status: false, message: 'Error' };
    }
  }

  public static async zustand() {
    const employee = useEmployeeStore((state) => state.employee);
    return employee;
  }
  public static async handleAuthV1(options: {
    empId: string;
    setApiLoading: React.Dispatch<React.SetStateAction<boolean>>;
    triggerPopup: (data: PopUpTypes) => void;
    setIsOtp: React.Dispatch<React.SetStateAction<boolean>>;
    setOtpHash: React.Dispatch<React.SetStateAction<string>>;
    setOtpToNumber: React.Dispatch<React.SetStateAction<string>>;
    setApiData: React.Dispatch<React.SetStateAction<any>>;
  }) {
    try {
      const apiUrl = configFile.api.common.login();
      options.setApiLoading(true);
      let api = await this.handleApi({
        url: apiUrl,
        type: 'POST',
        payload: {
          employee_id: options.empId,
        },
      });

      console.log(api, '///api');
      options.setApiLoading(false);

      console.log(api.data, '/////////data');

      switch (api.status) {
        case 200:
          const role = api.data.authInfo.role.toLowerCase();
          console.log(role, 'r0le');

          if (api.data.smsResponse) {
            options.setOtpToNumber(api.data.smsResponse.phoneNumber);
            options.setIsOtp(true);
            // options.setOtpToNumber(api.data.smsResponse.phoneNumber);
            return;
          } else {
            router.replace({
              pathname: '/ApiContex/fetchNparse',
              params: { role, empId: options.empId },
            });
            return;
          }

        case 404:
          options.triggerPopup('EmployeeId not Found');
          return;

        case 500:
          options.triggerPopup('Internal Server Error Try Again Later');
      }
    } catch (error: any) {
      console.log('error in handleAuthV1::', error);
    }
  }

  public static async verifyOtpV1(options: {
    otp: string;
    empId: string;
    triggerPopup: (data: PopUpTypes) => void;
    setApiLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOtp: React.Dispatch<React.SetStateAction<boolean>>;
  }) {
    try {
      options.setApiLoading(true);
      const apiUrl = configFile.api.common.verifyOtp();
      const api = await this.handleApi({
        url: apiUrl,
        type: 'POST',
        payload: { employee_id: options.empId, otp: options.otp },
      });

      switch (api.status) {
        case 200:
          options.setApiLoading(false);
          const role = api.data.authInfo.role;
          router.replace({
            pathname: '/ApiContex/fetchNparse',
            params: {
              role,
              empId: options.empId,
            },
          });

          return;

        case 400:
          options.setApiLoading(false);

          if (api.data.message == 'Invalid OTP') {
            options.triggerPopup('Incorrect OTP');
            return;
          }
          options.triggerPopup('Too Late Try Again From First !');
          options.setIsOtp(false);
          router.replace('/login');
        case 404:
          options.setApiLoading(false);
          options.triggerPopup('EmployeeId not Found');
          options.setIsOtp(false);

        case 500:
          options.setIsOtp(false);
          options.setApiLoading(false);

          options.triggerPopup('Internal Server Error Try Again Later');
      }
    } catch (error) {
      console.log('verifyOtpV1', error);
    }
  }

  public static async getEmpData(id: string): Promise<Record<string, any>> {
    try {
      const apiUrl = configFile.api.common.getEmpData(id);
      const api = await this.handleApi({ url: apiUrl, type: 'GET' });
      console.log(api, '/////apiEMp');
      switch (api.status) {
        case 200:
          return api.data;
        case 404:
          return {};
        case 500:
          return {};
      }
      return {};
    } catch (error) {
      console.log('getEmpData', error);
      return {};
    }
  }

  public static async handleEmpData(id: string) {
    try {
      const apiUrl = configFile.api.common.getEmpData(id);
      const api = await this.handleApi({ url: apiUrl, type: 'GET' });
      console.log(api.data, '///dataaaa');

      switch (api.status) {
        case 200:
          let status = api.data.status.toLowerCase();
          let role = api.data.role.toLowerCase();
          console.log(status, '////', role);
          if (status == 'active' || status == 'working') {
            if (role == 'employee') {
              router.replace({
                pathname: '/(tabs)/dashboard/attendance',
                params: { role, empId: api.data.employee_id },
              });
              return;
            }
            // router.replace('/(admin)/home');
            router.replace({
              pathname: '/(admin)/home',
              params: { role, empId: api.data.employee_id },
            });
            return;
          } else {
            router.replace('/quarantine');
          }
          return;

        case 404:
          router.replace('/login');
          return;

        case 500:
          router.replace('/login');
          return;
      }
    } catch (error) {
      console.log('errorHandleEmpData', error);
    }
  }

  // public static async verifyOtp(options: {
  //   otp: string;
  //   hash: string;
  //   apiData: any;
  //   triggerPopup: (data: PopUpTypes) => void;
  //   setApiLoading: React.Dispatch<React.SetStateAction<boolean>>;
  //   setIsOtp: React.Dispatch<React.SetStateAction<boolean>>;
  //   setOtpHash: React.Dispatch<React.SetStateAction<string>>;
  //   setOtpToNumber: React.Dispatch<React.SetStateAction<string>>;
  //   setApiData: React.Dispatch<React.SetStateAction<any>>;
  // }) {
  //   try {
  //     console.log();
  //     const url = configFile.api.verifyOtp();

  //     const request = await axios.post(url, { hash: options.hash, otp: options.otp });

  //     //console.log('\n\n', request.status, '//////verifyyyyyyyyOtppp/////////', request.data);

  //     // if (request.status === 400 && request.data.data.message === 'Incorrect Otp') {
  //     //   options.triggerPopup('Incorrect OTP');
  //     //   return;
  //     // }

  //     console.log(request.data, 'reqqqqqqqqqqq');

  //     if (request.status === 200 && request.data.message === 'Success Login') {
  //       await SecureStore.setItemAsync('STOKEN', request.data.data);

  //       router.replace({
  //         pathname: 'ApiContex/fetchNparse',
  //         params: {
  //           data: JSON.stringify(options.apiData),
  //         },
  //       });

  //       return;
  //     }
  //   } catch (error: any) {
  //     const resData = error.response.data;
  //     if (resData.message === 'Incorrect Otp' && !resData.success) {
  //       options.triggerPopup('Incorrect OTP');
  //       return;
  //     } else if (resData.message === 'Timeout') {
  //       options.triggerPopup('Too Late Try Again From First !');

  //       router.replace('/');
  //     }
  //     console.log(resData, 'ressssssssssssssSSdata');
  //     console.log('error in Api/verifyOtp', error);
  //   }
  // }

  // public static async handleAuth(options: {
  //   empId: string;
  //   setApiLoading: React.Dispatch<React.SetStateAction<boolean>>;
  //   triggerPopup: (data: PopUpTypes) => void;
  //   setIsOtp: React.Dispatch<React.SetStateAction<boolean>>;
  //   setOtpHash: React.Dispatch<React.SetStateAction<string>>;
  //   setOtpToNumber: React.Dispatch<React.SetStateAction<string>>;
  //   setApiData: React.Dispatch<React.SetStateAction<any>>;
  // }) {
  //   try {
  //     const url = configFile.api.fetchEmpData(options.empId);
  //     options.setApiLoading(true);
  //     let getData = await axios.get(url);
  //     console.log(getData.data);
  //     const data = getData.data.data;
  //     const token = getData.data.token;
  //     options.setApiData(data);
  //     const role = data.inAppRole;
  //     console.log(token, 'tokkkkken');
  //     if (role === 'Employee' && token) {
  //       await SecureStore.setItemAsync('STOKEN', token);
  //       router.replace({
  //         pathname: '/ApiContex/fetchNparse',
  //         params: {
  //           data,
  //         },
  //       });
  //       return;
  //     } else {
  //       const url = configFile.api.postOtp();
  //       try {
  //         options.setApiLoading(true);
  //         const request = await axios.post(url, { number: data.mobile });
  //         if (request.status === 201) {
  //           const hash = request.data.data.hash;
  //           options.setOtpHash(hash);
  //           console.log('\nOtpHash');
  //           options.setOtpToNumber(String(data.mobile));
  //           options.setIsOtp(true);
  //           options.setApiLoading(false);
  //         }
  //       } catch (error: any) {
  //         const resData = error.response.data;
  //         console.log(resData, 'resSSSSDARATTA');
  //         console.log('error in Api/handleAuthOtp::', error);
  //       }
  //     }
  //     // await this.handleMainUsers(data.);
  //   } catch (error: any) {
  //     const resData = error.response.data;
  //     if (resData.message === 'not-found') {
  //       options.triggerPopup('EmployeeId not Found');
  //       options.setApiLoading(false);
  //     }
  //     console.log(error.response.data, '////', error.response, '/////', error.response.config.data);
  //     console.log('error in Api/handleAuth', error);
  //   }
  // }

  // public static async verifyToken(token: string): Promise<Record<string, any> | false> {
  //   try {
  //     console.log('Invoking Verify Token');
  //     const url = configFile.api.verifyToken();
  //     console.log(url, 'urllllllllllllllllll');
  //     const req = await axios.get(url + '/' + token);

  //     console.log(req.data, '///', req.status);
  //     return { data: req.data.data };
  //   } catch (error: any) {
  //     const response = error.response;
  //     if (response.data.message === 'UnAuthorized') {
  //       // await SecureStore.deleteItemAsync('STOKEN');
  //       return false;
  //     }
  //     console.log(response.data);
  //     console.log('Api/verifyToken', error);
  //     return false;
  //   }
  // }

  // private static async handleMainUsers(number: string): Promise<string | false> {
  //   try {
  //     const url = configFile.api.postOtp();
  //     const req = await axios.post(url, {
  //       number,
  //     });

  //     return req.data.data.hash;
  //   } catch (error: any) {
  //     console.log('Api/HandleMainUsers', error);
  //     const resData = error.response.data;

  //     return false;
  //     //   if(resData.message === '')
  //   }
  // }
}
