import { View, Pressable } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react';
import { configFile } from '../config';

type Props = {
  onPress: () => void;
};

const LocationPinComponent = ({ onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        elevation: 10, // necessary for Android
        zIndex: 999,
        backgroundColor: configFile.colorGreen,
        borderRadius: 20,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Entypo name="location" size={24} color="white" />
    </Pressable>
  );
};

export default LocationPinComponent;
