import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import CookieManager from '@react-native-cookies/cookies';

interface CookieWebViewProps {
  url: string;
  cookieName: string;
  cookieValue: string;
  cookieDomain: string;
}

const CookieWebView: React.FC<CookieWebViewProps> = ({
  url,
  cookieName,
  cookieValue,
  cookieDomain,
}) => {
  const [cookieSet, setCookieSet] = useState(false);

  useEffect(() => {
    const setCookies = async () => {
      try {
        // Provide a full URL to CookieManager.set
        await CookieManager.set(url, {
          name: cookieName,
          value: cookieValue,
          domain: cookieDomain,
          path: '/',
          version: '1',
          secure: true,
          httpOnly: false,
        });

        // Retrieve cookies from the same full URL to verify
        const currentCookies = await CookieManager.get(url);
        console.log('✅ Cookies after setting:', currentCookies);

        setCookieSet(true);
      } catch (error) {
        console.error('❌ Error setting cookie:', error);
      }
    };

    setCookies();
  }, [url, cookieName, cookieValue, cookieDomain]);

  return !cookieSet ? (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <WebView source={{ uri: url }} sharedCookiesEnabled={true} startInLoadingState={true} />
  );
};

export default CookieWebView;
