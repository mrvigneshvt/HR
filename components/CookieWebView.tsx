// import React, { useEffect, useState } from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import WebView from 'react-native-webview';
// import CookieManager from '@react-native-cookies/cookies';

// const CookieWebView = ({ url, cookieName, cookieValue }) => {
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     CookieManager.set(url, {
//       name: cookieName,
//       value: cookieValue,
//       domain: 'sdceweb.lyzooapp.co.in',
//       path: '/',
//       version: '1',
//       secure: true,
//       httpOnly: false,
//     }).then(() => setReady(true));
//   }, []);

//   return (
//     <View style={{ flex: 1 }}>
//       {ready ? (
//         <WebView
//           source={{ uri: url }}
//           sharedCookiesEnabled={true}
//           thirdPartyCookiesEnabled={true}
//           domStorageEnabled={true}
//           javaScriptEnabled={true}
//           startInLoadingState={true}
//           renderLoading={() => (
//             <ActivityIndicator
//               color="#00668a"
//               size="large"
//               style={{ flex: 1, justifyContent: 'center' }}
//             />
//           )}
//         />
//       ) : (
//         <ActivityIndicator
//           color="#00668a"
//           size="large"
//           style={{ flex: 1, justifyContent: 'center' }}
//         />
//       )}
//     </View>
//   );
// };

// export default CookieWebView;
