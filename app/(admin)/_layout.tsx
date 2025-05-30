import { View, Text } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';

const _layout = () => {
  return (
    <>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
        <Tabs.Screen name="Announcement/index" options={{ title: 'Announcement' }} />
      </Tabs>
    </>
  );
};

export default _layout;
