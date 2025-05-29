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
  }) {
    try {
      const url = configFile.api.fetchEmpData(options.empId);
      options.setApiLoading(true);
      let getData = await axios.get(url);

      // console.log(getData, '//////////gettttttttttDataaaaaaaaaaa');

      if (getData.status === 404) {
        return options.triggerPopup('EmployeeId not Found');
      }
      console.log(getData.data);
      const data = getData.data.data;
      const role = data.inAppRole;
      options.setApiLoading(false);
      if (role === 'Employee' && getData) {
        router.replace({
          pathname: '/ApiContex/fetchNparse',
          params: {
            data: getData,
          },
        });
        return;
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
