import { View, Text } from 'react-native';
import React from 'react';
import LoadingScreen from 'components/LoadingScreen';
import { useLocalSearchParams } from 'expo-router';

const fetchNparse = () => {
  const empData = useLocalSearchParams();
  const data = JSON.parse(empData.data);
  console.log(data, 'data');
  console.log(empData.data);
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <LoadingScreen />
    </View>
  );
};

export default fetchNparse;
