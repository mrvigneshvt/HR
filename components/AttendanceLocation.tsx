import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { configFile } from '../config';
import { DashMemory } from '../Memory/DashMem';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { customPlugins } from 'plugins/plug';
import { router, useFocusEffect } from 'expo-router';
import axios, { AxiosError } from 'axios';
import { convertFormet, convertTo12HourFormat, getTodayDateString } from '../utils/validation';
import { useEmployeeStore } from 'Memory/Employee';

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

type Attendance = {
  check_in_time: string | null;
  lunch_in_time: string | null;
  check_out_time: string | null;
  // ...other fields as needed
};

const API_BASE = 'https://sdce.lyzooapp.co.in:31313/api/attendance';

const AttendanceLocation = ({ Region, Address, isNear }: Props) => {
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const employees = useEmployeeStore((state) => state.employee);

  const dashboard = DashMemory((state) => state.dashboard?.user?.dailyAttendance);

  const getEmployeeId = async () => {
    return employees?.employee_id;
  };

  const fetchAttendance = async () => {
    setLoading(true);
    const employeeId = await getEmployeeId();
    try {
      const today = convertFormet(new Date())
      const res = await axios.get(`${API_BASE}/getAttendanceDetails`, {
        params: { employeeId },
      });
      const todayAttendance = res?.data?.data?.filter((i: any) => i?.attendance_date === today);
      setAttendance(todayAttendance?.[0]);
      if (todayAttendance?.length === 0) {
        Alert.alert("You don't have an schedule today", "please contact manager",
          [{
            text: 'OK', onPress: () => {
              router.back()
            }
          },
          ]
        )
      }
    } catch (err) {
      setAttendance(null);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAttendance();
    }, [])
  )

  const getNextAction = () => {
    if (!attendance) return null;
    if (!attendance.check_in_time) return 'checkIn';
    if (!attendance.lunch_in_time) return 'lunchIn';
    if (!attendance.check_out_time) return 'checkOut';
    return null;
  };
  const handleAction = async () => {
    if (!isNear) {
      Alert.alert('You are not inside the location.');
      return;
    }
    setActionLoading(true);
    const employeeId = await getEmployeeId();
    const date = getTodayDateString();
    const latitude = Region.latitude;
    const longitude = Region.longitude;
    let url = '';
    let body: any = { employeeId, date, latitude, longitude };

    const now = new Date();
    const timeString = now.toTimeString().slice(0, 8);

    try {
      let res;
      switch (getNextAction()) {
        case 'checkIn':
          url = `${API_BASE}/checkIn`;
          body = { ...body, check_in_time: timeString };
          res = await axios.post(url, body);
          Alert.alert('Success', res.data.message || 'Check-in successful');
          break;
        case 'lunchIn':
          url = `${API_BASE}/lunchIn`;
          body = { ...body, lunch_in_time: timeString };
          res = await axios.post(url, body);
          Alert.alert('Success', res.data.message || 'Lunch-in successful');
          break;
        case 'checkOut':
          url = `${API_BASE}/checkOut`;
          body = { ...body, check_out_time: timeString };
          res = await axios.post(url, body);
          Alert.alert('Success', res.data.message || 'Check-out successful');
          break;
        default:
          Alert.alert('All actions completed for today.');
          return;
      }
      fetchAttendance();
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        Alert.alert('Error', err.response.data.message);
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  const nextAction = getNextAction();
  let buttonLabel = '';
  if (nextAction === 'checkIn') buttonLabel = 'Clock IN';
  else if (nextAction === 'lunchIn') buttonLabel = 'Lunch';
  else if (nextAction === 'checkOut') buttonLabel = 'Clock OUT';

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
            <Text className="text-xl font-bold">Lunch</Text>
            <Text className="text-xl font-bold">Check Out</Text>

          </View>
          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <Text className={`text-lga mx-2 font-semibold text-[${configFile.colorGreen}]`}>
                {attendance?.check_in_time ? convertTo12HourFormat(attendance?.check_in_time) : '--:--'}
              </Text>
            </View>
            <View>
              <Text className={`text-lga mx-2 font-semibold text-[${configFile.colorGreen}]`}>
                {attendance?.lunch_in_time ? convertTo12HourFormat(attendance?.lunch_in_time) : '--:--'}
              </Text>
            </View>
            <View>
              <Text className={`text-lga mx-2 font-semibold text-[${configFile.colorGreen}]`}>
                {attendance?.check_out_time ? convertTo12HourFormat(attendance?.check_out_time) : '--:--'}
              </Text>
            </View>
          </View>
        </View>
        {nextAction ? (
          <TouchableOpacity
            onPress={handleAction}
            disabled={actionLoading}
            className="flex-row items-center justify-center gap-2 self-center rounded-3xl bg-gray-200 p-2">
            <Text className="text-lg font-bold " style={{ color: configFile.colorGreen }}>
              {actionLoading ? 'Processing...' : buttonLabel}
            </Text>
            <MaterialIcons
              name="location-history"
              size={moderateScale(30)}
              color={configFile.colorGreen}
            />
          </TouchableOpacity>
        ) : (
          <View className="flex-row justify-center mt-2">
            <Text className="text-gray-400">All actions completed for today.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default AttendanceLocation;