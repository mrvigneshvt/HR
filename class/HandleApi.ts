import { configFile } from 'config';
import React from 'react';
import useState from 'react';
import axios from 'axios';
import { PopUpTypes } from '../app/index';
import { router } from 'expo-router';

export class Api {
  public static async handleAuth(options: {
    empId: string;
    setApiLoading: React.Dispatch<React.SetStateAction<boolean>>;
    triggerPopup: (data: PopUpTypes) => void;
    setIsOtp: React.Dispatch<React.SetStateAction<boolean>>;
    setOtpHash: React.Dispatch<React.SetStateAction<string>>;
    setOtpToNumber: React.Dispatch<React.SetStateAction<string>>;
  }) {
    try {
      const url = configFile.api.fetchEmpData(options.empId);
      options.setApiLoading(true);
      let getData = await axios.get(url);

      if (getData.status === 404) {
        return options.triggerPopup('EmployeeId not Found');
      }
      console.log(getData.data);
      const data = getData.data.data;
      const role = data.inAppRole;
      console.log(getData, 'getDataaaaaa');
      if (role === 'Employee' && getData) {
        router.replace({
          pathname: '/ApiContex/fetchNparse',
          params: {
            data: getData,
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

  public static async verifyOtp(options: { otp: string; hash: string }) {
    try {
      const url = configFile.api.verifyOtp();

      const request = await axios.post(url, { hash: options.hash, otp: options.otp });

      console.log('\n\n', request.status, '//////verifyyyyyyyyOtppp/////////', request.data);

      if (request.status === 200 && request.data.data.message === 'Success Login') {
      }
    } catch (error: any) {
      const resData = error.response.data;
      console.log('error in Api/verifyOtp', error);
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
