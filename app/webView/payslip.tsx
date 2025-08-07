import React from 'react';
import { SafeAreaView } from 'react-native';
import CookieWebView from 'components/CookieWebView';
import { configFile } from 'config';

const PayslipScreen = () => {
  const cookieValue = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // JWT token
  const url = configFile.backendBaseUrl;
  //mohinth 'https://sdceweb.lyzooapp.co.in:32323/';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CookieWebView
        url={url}
        cookieName="auth_token"
        cookieValue={cookieValue}
        cookieDomain="sdceweb.lyzooapp.co.in" // ✅ Just domain, no port
      />
    </SafeAreaView>
  );
};

export default PayslipScreen;
