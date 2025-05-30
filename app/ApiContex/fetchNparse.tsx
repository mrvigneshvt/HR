import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import LoadingScreen from 'components/LoadingScreen';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const fetchNparse = () => {
  const [token, setToken] = useState<string | null>('');
  const empData: any = useLocalSearchParams();
  console.log(empData, 'e,pppppdata');

  const data = JSON.parse(empData.data);
  console.log(data, 'data');

  const fetchToken = async () => {
    const token = await SecureStore.getItemAsync('STOKEN');
    setToken(token);
    console.log('tokennnnnn', token);
  };

  useEffect(() => {
    fetchToken();
  }, []);
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <LoadingScreen />
      <Text>{`Welcome ${data.designation}`}</Text>
    </View>
  );
};

export default fetchNparse;
