import { View, Text } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { router } from 'expo-router';

const _layout = () => {
  // React.useEffect(() => {
  //   const onBackPress = () => {
  //     router.replace('/home',);
  //     return true;
  //   };

  //   BackHandler.addEventListener('hardwareBackPress', onBackPress);

  //   return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  // }, []);

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          // Hide tab bar on specific screens
          tabBarStyle: { display: 'none' },
        })}>
        <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
        <Tabs.Screen name="Announcement/index" options={{ title: 'Announcement' }} />
      </Tabs>
    </>
  );
};

export default _layout;
