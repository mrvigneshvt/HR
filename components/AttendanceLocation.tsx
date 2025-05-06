import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { configFile } from '../config';
import { DashMemory } from 'Memory/DashMem';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { customPlugins } from 'plugins/plug';
import { router } from 'expo-router';

const manImage = require('../assets/man.webp');

type Props = {
  isNear: boolean;
  Region: {
    latitude: number;
    latitudeDelta?: number | undefined;
    longitude: number;
    longitudeDelta?: number | undefined;
  };
  Address?: string;
};

const AttendanceLocation = ({ Region, Address, isNear }: Props) => {
  // console.log(Region, 'regg');
  const dashboard = DashMemory((state) => state.dashboard?.user?.dailyAttendance);

  const handleClocking = () => {
    if (!isNear) {
      Alert.alert('You are Not Inside the Location. Get Inside the given Location and Try');
      return;
    } else {
      router.push('/emp-plugins/Camera');
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 8, paddingBottom: 300 }}>
      <View className="flex flex-col gap-2">
        <View>
          <Text className="text-xl font-semibold">Address</Text>
          {Address ? <Text className="text-sm ">{Address}</Text> : <></>}
          <View className="flex-row gap-2">
            {Region.latitude && Region.longitude ? (
              <>
                <Text className={`text-sm text-gray-400 `}>{`Lat: ${Region.latitude}`}</Text>
                <Text className={`text-sm text-gray-400 `}>{`Long: ${Region.longitude}`}</Text>
              </>
            ) : (
              <></>
            )}
          </View>
        </View>

        <View className={` mt-2 flex-col gap-4 bg-red-50 p-2`}>
          <View className="flex-row justify-between">
            <Text className="text-xl font-bold">Check In</Text>
            <Text className="text-xl font-bold">Check Out</Text>
          </View>
          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <Text className={`text-lga mx-2 font-semibold text-[${configFile.colorGreen}]`}>
                {dashboard?.checkIn ? dashboard.checkIn : '--:--'}
              </Text>
            </View>
            <View>
              <Text className={`text-lga mx-2 font-semibold text-[${configFile.colorGreen}]`}>
                {dashboard?.checkOut ? dashboard.checkOut : '--:--'}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleClocking()}
          className="flex-row items-center justify-center gap-2 self-center rounded-3xl bg-gray-200 p-2">
          <Text className="text-lg font-bold " style={{ color: configFile.colorGreen }}>
            {!dashboard?.checkIn ? 'Clock IN' : 'Clock OUT'}
          </Text>
          <MaterialIcons
            name="location-history"
            size={moderateScale(30)}
            color={configFile.colorGreen}
          />
        </TouchableOpacity>
        <View className="flex-row justify-center">
          <Text className="text-gray-400">{`(Above Button isnt Functional Yet)`}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default AttendanceLocation;
