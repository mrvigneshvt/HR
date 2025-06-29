import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { configFile } from '../../../config';
import { Api } from 'class/HandleApi';
import { State } from 'class/State';
import { NavRouter } from 'class/Router';
import DashTop from 'components/DashTop'; // Uncomment when needed

const HomeScreen = () => {
  const router = useRouter();
  const { role, empId } = useLocalSearchParams<{ role: string; empId: string }>();
  const [empData, setEmpData] = useState<Record<string, any> | null>(null);

  const navigateTo = useCallback(
    (pathname: string) => router.push({ pathname, params: { role, empId } }),
    [router, role, empId]
  );

  const setupEmpData = useCallback(async () => {
    try {
      const response = await Api.getEmpData(String(empId));
      if (response) {
        State.storeEmpData(response);
        setEmpData(response);
      }
    } catch (error) {
      console.error('Error fetching emp data:', error);
    }
  }, [empId]);

  useEffect(() => {
    setupEmpData();
    NavRouter.BackHandler({ role, empId });
  }, [setupEmpData]);

  const menuCards = useMemo(
    () => [
      {
        key: 'employees',
        title: 'Employees',
        icon: 'people',
        description: 'Manage employee information and records',
        color: '#4A90E2',
        route: '/employees',
      },
      {
        key: 'requests',
        title: 'Requests',
        icon: 'document-text',
        description: 'Handle uniform and leave requests',
        color: '#50C878',
        route: '/requests',
      },
      {
        key: 'clients',
        title: 'Clients',
        icon: 'business',
        description: 'Manage client information and status',
        color: '#FF6B6B',
        route: '/clients',
      },
      {
        key: 'attendance',
        title: 'Attendance',
        icon: 'calendar',
        description: 'View employee attendance details',
        color: '#FF6B6B',
        route: '/attendance',
      },
      {
        key: 'payslip',
        title: 'Pay Slip',
        icon: 'cash',
        description: 'View your PaySlip details',
        color: '#4A90E2',
        route: '/emp-plugins/pay_slip',
      },
      {
        key: 'leave_request',
        title: 'Leave Request',
        icon: 'holiday-village',
        isFontisto: true,
        description: 'Raise Leave Request to Management',
        color: '#4A90E2',
        route: '/emp-plugins/leave_request',
      },
    ],
    [navigateTo]
  );

  const renderMenuCard = ({ key, icon, title, description, color, route, isFontisto }: any) => (
    <Pressable
      key={key}
      onPress={() => navigateTo(route)}
      className="mb-4 rounded-lg bg-white p-6 shadow-sm">
      <View className="flex-row items-center">
        <View
          className="mr-4 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: color }}>
          {isFontisto ? (
            <Fontisto name={icon} size={24} color={color} />
          ) : (
            <Ionicons name={icon} size={24} color={color} />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-xl font-semibold">{title}</Text>
          <Text className="mt-1 text-gray-600">{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Home',
          headerStyle: { backgroundColor: configFile.colorGreen },
          headerTintColor: 'white',
          headerRight: () => (
            <View className="flex flex-row gap-1">
              <TouchableOpacity onPress={() => router.push('/emp-plugins/notification')}>
                <Ionicons name="notifications" size={24} color="#3a7129" />
              </TouchableOpacity>
              <Pressable onPress={() => router.replace('/login')} style={{ paddingHorizontal: 10 }}>
                <MaterialIcons name="logout" size={24} color="white" />
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView className="flex-1 p-4">
        {/* <View className="mb-3 bg-white p-6">
          <Text className="text-2xl font-bold">Welcome, {role}</Text>
          <Text className="mt-1 text-gray-600">ID: {empId}</Text>
        </View> */}

        {/* Optional: Top profile display */}
        {empData && (
          <DashTop role={''} name={empData.name} empId={empId} img={empData.profile_image} />
        )}

        {role.toLowerCase() == 'executive' && (
          <Pressable onPress={() => navigateTo('/(tabs)/dashboard/attendance')}>
            <View className="mb-3 flex-row items-center rounded-lg bg-white p-6 shadow-sm">
              <Text className="grow text-2xl font-bold">Mark your Attendance</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </View>
          </Pressable>
        )}

        {menuCards.map(renderMenuCard)}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
