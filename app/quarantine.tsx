import { View, Text } from 'react-native';
import React from 'react';
import { configFile } from 'config';
import InActive from './inactive';

const quarantine = () => {
  return (
    <View
      className="flex flex-1 items-center justify-center bg-red-900"
      style={{ backgroundColor: configFile.colorGreen }}>
      <Text>Your Employee Status is InActive</Text>
    </View>
  );
};

export default quarantine;
