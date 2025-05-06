import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import LiveClockComponent from './LiveClockComponent';
import { configFile } from '../config';
import Feather from '@expo/vector-icons/Feather';

const TimeDetails = () => {
  return (
    // <ScrollView>
    <View
      className="m-2 mt-4 overflow-hidden rounded-xl"
      style={{ backgroundColor: configFile.colorGreen }}>
      {/* Live Clock */}
      <LiveClockComponent iconColor="black" timeColor="white" />

      {/* Daily Timing Info */}
      <View className="m-4 rounded-xl bg-red-50 p-4">
        <Text
          className="mb-4 self-center rounded-3xl p-2 text-center text-lg font-bold"
          style={{ color: 'white', backgroundColor: configFile.colorGreen }}>
          Daily Timings
        </Text>

        <View className="flex-row justify-between">
          {/* Check In */}
          <View className="items-center">
            <Feather name="log-in" size={28} color={configFile.colorGreen} />
            <Text className="mt-1 font-bold text-gray-700">Check In</Text>
            <Text className="text-gray-600">10:00 AM</Text>
          </View>

          {/* Check Out */}
          <View className="items-center">
            <Feather name="log-out" size={28} color={configFile.colorGreen} />
            <Text className="mt-1 font-bold text-gray-700">Check Out</Text>
            <Text className="text-gray-600">06:30 PM</Text>
          </View>
        </View>
      </View>
    </View>
    // </ScrollView>
  );
};

export default TimeDetails;
