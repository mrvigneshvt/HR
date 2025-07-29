import React from 'react';
import { SafeAreaView } from 'react-native';
import CookieWebView from 'components/CookieWebView';

const PayslipScreen = () => {
  const dynamicId = 'SFM226'; // ← Replace with a real dynamic value
  const cookieName = 'auth'; // e.g., 'authToken'
  const cookieValue =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9yb3dfaWQiOjQ0OTQ5LCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5hbWUiOiJWaWduZXNoIEx5em9vIiwiZW1wbG95ZWVfaWQiOiJTRk0xMDEiLCJkZXBhcnRtZW50IjoidGVzdCBkZXBhcnRtZW50IiwiaWF0IjoxNzUzNTI4MzgxLCJleHAiOjE3ODUwODU5ODF9.EqReaRbeencxi6rk3cNka_QOtCsOZv0bSLDfZappYUA';
  const url = `https://sdceweb.lyzooapp.co.in:32323/payroll/print-payslip/${dynamicId}`;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CookieWebView url={url} cookieName={cookieName} cookieValue={cookieValue} />
    </SafeAreaView>
  );
};

export default PayslipScreen;
