import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

const index = () => {
  return (
    <View>
      <Stack.Screen options={{ headerShown: false }} />
      <View></View>
    </View>
  );
};

export default index;
