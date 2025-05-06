import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import ProfileStack from 'Stacks/HeaderStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

const id_card = () => {
  return (
    <>
      <ProfileStack IdCard={true} />
      <SafeAreaView
        style={{ backgroundColor: 'red', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View className="mx-1 bg-white ">
          <View style={{ height: 200, width: 200, borderRadius: 2 }}></View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default id_card;
