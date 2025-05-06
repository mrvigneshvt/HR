import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import React from 'react';
import { configFile } from '../config';
import HistoryMiddle from './HistoryMiddle';

const green = configFile.colorGreen;

type Props = {
  callback?: (data: 'Ann' | 'Req') => void;
};

const NotifTop = ({ callback }: Props) => {
  const handlePress = (data: 'Ann' | 'Req') => {
    setState(data);
    callback(data);
  };
  const [state, setState] = useState('Ann');
  //console.log(state);
  return (
    <View className=" flex-row justify-around rounded-2xl bg-gray-200 p-0.5">
      <Pressable onPress={() => handlePress('Ann')}>
        <View
          className={`rounded-3xl p-3 px-6 ${state === 'Ann' ? `bg-[${green}]` : ''}`}
          style={{ borderRadius: 24 }}>
          <Text
            className={`text-lg font-semibold ${state !== 'Ann' ? 'text-black' : 'text-white'} text-black`}>
            Announcement
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={(e) => {
          handlePress('Req');
        }}>
        <View className={`rounded-3xl p-3 ${state === 'Req' ? `bg-[${green}] text-white` : ''}`}>
          <Text
            className={`text-lg font-semibold ${state !== 'Req' ? 'text-black' : 'text-white'}`}>
            Request Approval
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default NotifTop;
