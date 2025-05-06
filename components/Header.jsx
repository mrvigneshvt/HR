import { View, Text } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';

const Header = () => {
  return (
    <View className=" flex w-screen self-center bg-[#ec1a1a]">
      <Image
        style={{ height: 70, width: 70, borderRadius: 2 }}
        source={require('../assets/logo.jpg')}
      />
    </View>
  );
};

export default Header;
