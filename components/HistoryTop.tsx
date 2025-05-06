import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import React from 'react';
import { configFile } from '../config';
import HistoryMiddle from './HistoryMiddle';

const green = configFile.colorGreen;

type Props = {
  callback: (data: string) => void;
};

const HistoryTop = ({ callback }: Props) => {
  const handlePress = (data: string) => {
    setState(data);
    callback(data);
  };
  const [state, setState] = useState('His');
  console.log(state);
  return (
    <View className=" flex-row justify-around rounded-2xl bg-gray-200 p-0.5">
      <Pressable onPress={() => handlePress('His')}>
        <View className={`rounded-3xl p-3 px-6 ${state === 'His' ? `bg-[${green}]` : ''}`}>
          <Text
            className={`text-lg font-semibold ${state !== 'His' ? 'text-black' : 'text-white'} text-black`}>
            History
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={(e) => {
          handlePress('Ate');
        }}>
        <View className={`rounded-3xl p-3 ${state === 'Ate' ? `bg-[${green}] text-white` : ''}`}>
          <Text
            className={`text-lg font-semibold ${state !== 'Ate' ? 'text-black' : 'text-white'}`}>
            Attendance Calendar
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default HistoryTop;
