import { configFile } from 'config';
import React from 'react';
import useState from 'react';
import axios from 'axios';
import { PopUpTypes } from '../app/index';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export class Api {
  public static async handleAuth(options: {
    empId: string;
    setApiLoading: React.Dispatch<React.SetStateAction<boolean>>;
    triggerPopup: (data: PopUpTypes) => void;
    setIsOtp: React.Dispatch<React.SetStateAction<boolean>>;
    setOtpHash: React.Dispatch<React.SetStateAction<string>>;
    setOtpToNumber: React.Dispatch<React.SetStateAction<string>>;
    setApiData: React.Dispatch<React.SetStateAction<any>>;
  }) {
    try {
      const url = configFile.api.fetchEmpData(options.empId);
      options.setApiLoading(true);
      let getData = await axios.get(url);
      console.log(getData.data);
      const data = getData.data.data;
      const token = getData.data.token;
      options.setApiData(data);
      const role = data.inAppRole;
      console.log(token, 'tokkkkken');
      if (role === 'Employee' && token) {
        await SecureStore.setItemAsync('STOKEN', token);
        router.replace({
          pathname: '/ApiContex/fetchNparse',
          params: {
            data,
          },
        });
        return;
      } else {
        const url = configFile.api.postOtp();
        try {
          options.setApiLoading(true);
          const request = await axios.post(url, { number: data.mobile });
          if (request.status === 201) {
            const hash = request.data.data.hash;
            options.setOtpHash(hash);
            console.log('\nOtpHash');
            options.setOtpToNumber(String(data.mobile));
            options.setIsOtp(true);
            options.setApiLoading(false);
          }
        } catch (error: any) {
          const resData = error.response.data;
          console.log(resData, 'resSSSSDARATTA');
          console.log('error in Api/handleAuthOtp::', error);
        }
      }
      // await this.handleMainUsers(data.);
    } catch (error: any) {
      const resData = error.response.data;
      if (resData.message === 'not-found') {
        options.triggerPopup('EmployeeId not Found');
        options.setApiLoading(false);
      }
      console.log(error.response.data, '////', error.response, '/////', error.response.config.data);
      console.log('error in Api/handleAuth', error);
    }
  }

  public static async verifyOtp(options: {
    otp: string;
    hash: string;
    apiData: any;
    triggerPopup: (data: PopUpTypes) => void;
    setApiLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOtp: React.Dispatch<React.SetStateAction<boolean>>;
    setOtpHash: React.Dispatch<React.SetStateAction<string>>;
    setOtpToNumber: React.Dispatch<React.SetStateAction<string>>;
    setApiData: React.Dispatch<React.SetStateAction<any>>;
  }) {
    try {
      console.log();
      const url = configFile.api.verifyOtp();

      const request = await axios.post(url, { hash: options.hash, otp: options.otp });

      //console.log('\n\n', request.status, '//////verifyyyyyyyyOtppp/////////', request.data);

      // if (request.status === 400 && request.data.data.message === 'Incorrect Otp') {
      //   options.triggerPopup('Incorrect OTP');
      //   return;
      // }

      console.log(request.data, 'reqqqqqqqqqqq');

      if (request.status === 200 && request.data.message === 'Success Login') {
        await SecureStore.setItemAsync('STOKEN', request.data.data);

        router.replace({
          pathname: 'ApiContex/fetchNparse',
          params: {
            data: JSON.stringify(options.apiData),
          },
        });

        return;
      }
    } catch (error: any) {
      const resData = error.response.data;
      if (resData.message === 'Incorrect Otp' && !resData.success) {
        options.triggerPopup('Incorrect OTP');
        return;
      } else if (resData.message === 'Timeout') {
        options.triggerPopup('Too Late Try Again From First !');

        router.replace('/');
      }
      console.log(resData, 'ressssssssssssssSSdata');
      console.log('error in Api/verifyOtp', error);
    }
  }

  public static async verifyToken(token: string): Promise<Record<string, any> | false> {
    try {
      console.log('Invoking Verify Token');
      const url = configFile.api.verifyToken();
      console.log(url, 'urllllllllllllllllll');
      const req = await axios.get(url + '/' + token);

      console.log(req.data, '///', req.status);
      return { data: req.data.data };
    } catch (error: any) {
      const response = error.response;
      if (response.data.message === 'UnAuthorized') {
        // await SecureStore.deleteItemAsync('STOKEN');
        return false;
      }
      console.log(response.data);
      console.log('Api/verifyToken', error);
      return false;
    }
  }

  private static async handleMainUsers(number: string): Promise<string | false> {
    try {
      const url = configFile.api.postOtp();
      const req = await axios.post(url, {
        number,
      });

      return req.data.data.hash;
    } catch (error: any) {
      console.log('Api/HandleMainUsers', error);
      const resData = error.response.data;

      return false;
      //   if(resData.message === '')
    }
  }
}
