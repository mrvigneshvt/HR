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
import { NavRouter } from 'class/Router';
import { todayString } from 'react-native-calendars/src/expandableCalendar/commons';

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
  cbLocation: ({ lat, lon }: { lat: number; lon: number }) => void;
  empId: string;
  role: string;
  // showButton: boolean;
};

type Attendance = {
  check_in_time: string | null;
  lunch_in_time: string | null;
  check_out_time: string | null;
  // ...other fields as needed
};

const CLIENT_API_BASE = configFile.api.superAdmin.clients;
// `https://sdce.lyzooapp.co.in:31313/api/clients/`;   //toChange
const API_BASE = configFile.api.superAdmin.attendance;
// 'https://sdce.lyzooapp.co.in:31313/api/attendance';

const AttendanceLocation = ({ Region, Address, isNear, cbLocation, empId, role }: Props) => {
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const employees = useEmployeeStore((state) => state.employee);
  const [locState, setLocState] = useState<'past' | 'before'>();
  const [issue, setIssue] = useState();

  // const dashboard = DashMemory((state) => state.dashboard?.user?.dailyAttendance);

  const getEmployeeId = async () => {
    console.log(employees, '///');
    return employees?.employee_id;
  };

  const fetchAttendance = async () => {
    setLoading(true);
    const employeeId = await getEmployeeId();
    try {
      const today = convertFormet(new Date());
      console.log(today, '/todayDAte/', empId);
      const res = await axios.get(
        `${API_BASE}/getAttendanceDetails?employeeId=${empId.toUpperCase()}`
      );
      const data = res.data.data;
      console.log(data, '/////?REsponse');

      if (data?.length === 0) {
        Alert.alert("You don't have an schedule today", 'please contact manager', [
          {
            text: 'OK',
            onPress: () => {
              NavRouter.backOrigin({ role, empId });
            },
          },
        ]);
      }

      // console.log('////////////', res.data, 'resss');
      // console.log(today, 'todaydate');
      const todayAttendance = res?.data?.data?.filter((i: any) => i?.attendance_date === today);
      // console.log(todayAttendance, 'prrrrrrrrrrrrrrr');
      setAttendance(todayAttendance[0]);
      console.log(todayAttendance[0], 'todayyy');
    } catch (err) {
      setAttendance(null);
      console.log('error in fetchAttendance', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('use fom');
    // setInterval(() => {
    if (attendance && attendance.latitude && attendance.longitude) {
      console.log('gets in');
      cbLocation({
        lat: Number(attendance.latitude),
        lon: Number(attendance.longitude),
      });
    }
    // }, 3000);
  }, [attendance]); // ✅ only run when `attendance` updates

  useFocusEffect(
    React.useCallback(() => {
      fetchAttendance();
    }, [])
  );

  const getNextAction = () => {
    if (!attendance) return null;
    if (!attendance.check_in_time) return 'checkIn';
    if (!attendance.lunch_in_time) return 'lunchIn';
    if (!attendance.check_out_time) return 'checkOut';
    return null;
  };
  const handleAction = async () => {
    // if (!isNear) {
    //   Alert.alert('You are not inside the location.');
    //   return;
    // }
    setActionLoading(true);
    const employeeId = await getEmployeeId();
    const date = getTodayDateString();
    const latitude = Region.latitude;
    const longitude = Region.longitude;
    let url = '';
    let body: any = { employeeId: empId, date, latitude, longitude };

    const now = new Date();
    const timeString = now.toTimeString().slice(0, 8);

    try {
      let res;
      switch (getNextAction()) {
        case 'checkIn':
          if (!isNear) return Alert.alert('You Are Not Inside the Location');
          url = `${API_BASE}/checkIn`;
          body = { ...body, check_in_time: timeString };
          console.log('////////', body, '/////body');
          res = await axios.post(url, body);
          Alert.alert('Success', res.data.message || 'Check-in successful');
          router.back();
          break;
        case 'lunchIn':
          if (!isNear) return Alert.alert('You Are Not Inside the Location');
          url = `${API_BASE}/lunchIn`;
          body = { ...body, lunch_in_time: timeString };
          res = await axios.post(url, body);
          Alert.alert('Success', res.data.message || 'Lunch-in successful');
          router.back();
          break;
        case 'checkOut':
          if (!isNear) return Alert.alert('You Are Not Inside the Location');
          url = `${API_BASE}/checkOut`;
          body = { ...body, check_out_time: timeString };
          res = await axios.post(url, body);
          Alert.alert('Success', res.data.message || 'Check-out successful');
          router.back();
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
        console.log(err.response);
        console.log(err.response.data, 'errrDatra');
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
                <Text className={`text-sm text-gray-800 `}>{'(Yours)'}</Text>
              </>
            ) : (
              <></>
            )}
          </View>
          {attendance && attendance.latitude && attendance.longitude ? (
            <View className="flex-row">
              <Text className={`text-sm text-gray-400 `}>{`Lat: ${attendance.latitude}`}</Text>
              <Text className={`text-sm text-gray-400 `}>{`Long: ${attendance.longitude}`}</Text>
              <Text className={`text-sm text-gray-800 `}>{'(Assigned Location)'}</Text>
            </View>
          ) : (
            <></>
          )}
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
                {attendance?.check_in_time
                  ? convertTo12HourFormat(attendance?.check_in_time)
                  : '--:--'}
              </Text>
            </View>
            <View>
              <Text className={`text-lga mx-2 font-semibold text-[${configFile.colorGreen}]`}>
                {attendance?.lunch_in_time
                  ? convertTo12HourFormat(attendance?.lunch_in_time)
                  : '--:--'}
              </Text>
            </View>
            <View>
              <Text className={`text-lga mx-2 font-semibold text-[${configFile.colorGreen}]`}>
                {attendance?.check_out_time
                  ? convertTo12HourFormat(attendance?.check_out_time)
                  : '--:--'}
              </Text>
            </View>
          </View>
        </View>
        {nextAction ? (
          <TouchableOpacity
            onPress={() => {
              handleAction();
            }}
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
          <View className="mt-2 flex-row justify-center">
            <Text className="text-gray-400">All actions completed for now.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default AttendanceLocation;
