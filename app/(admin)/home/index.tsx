import React, { useEffect, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, BackHandler, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { configFile } from '../../../config';
import { useEmployeeStore } from 'Memory/Employee';
import { Api } from 'class/HandleApi';

const HomeScreen = () => {
  const router = useRouter();
  const { role, empId } = useLocalSearchParams();

  const setupEmpData = async () => {
    try {
      console.log('Invoking EMP ID:', empId);
      const response = await Api.getEmpData(String(empId));
      if (!response) {
        console.log('Response Failed...');
      } else {
        console.log('Received emp Data:', response);
        useEmployeeStore.getState().setEmployee(response);
      }
    } catch (error) {
      console.error('Error fetching emp data:', error);
    }
  };

  useEffect(() => {
    setupEmpData();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      router.replace({
        pathname: '/(admin)/home',
        params: { role, empId },
      });
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, []);

  const navigateTo = (pathname: string) => {
    router.push({ pathname, params: { role, empId } });
  };

  const handlePluginPress = (plugin: 'payslip' | 'leave_request') => {
    const pathMap = {
      payslip: '/emp-plugins/pay_slip',
      leave_request: '/emp-plugins/leave_request',
    };
    navigateTo(pathMap[plugin]);
  };

  const menuCards = useMemo(
    () => [
      {
        title: 'Employees',
        icon: 'people',
        route: '/employees',
        color: '#4A90E2',
        description: 'Manage employee information and records',
        onPress: () => navigateTo('/employees'),
      },
      {
        title: 'Requests',
        icon: 'document-text',
        route: '/requests',
        color: '#50C878',
        description: 'Handle uniform and leave requests',
        onPress: () => navigateTo('/requests'),
      },
      {
        title: 'Clients',
        icon: 'business',
        route: '/clients',
        color: '#FF6B6B',
        description: 'Manage client information and status',
        onPress: () => navigateTo('/clients'),
      },
      {
        title: 'Attendance',
        icon: 'calendar',
        route: '/attendance',
        color: '#FF6B6B',
        description: 'View employee attendance details',
        onPress: () => navigateTo('/attendance'),
      },
      {
        title: 'Pay Slip',
        icon: 'cash',
        route: '/emp-plugins/pay_slip',
        color: '#4A90E2',
        description: 'View your PaySlip details',
        onPress: () => handlePluginPress('payslip'),
      },
      {
        title: 'Leave Request',
        icon: 'holiday-village',
        route: '/emp-plugins/leave_request',
        color: '#4A90E2',
        description: 'Raise Leave Request to Management',
        onPress: () => handlePluginPress('leave_request'),
        isFontisto: true,
      },
    ],
    [role, empId]
  );

  const renderMenuCard = (card: any) => (
    <Pressable
      key={card.title}
      onPress={card.onPress}
      className="mb-4 rounded-lg bg-white p-6 shadow-sm">
      <View className="flex-row items-center">
        <View
          className="mr-4 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: `${card.color}` }}>
          {card.isFontisto ? (
            <Fontisto name={card.icon} size={24} color={card.color} />
          ) : (
            <Ionicons name={card.icon} size={24} color={card.color} />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-xl font-semibold">{card.title}</Text>
          <Text className="mt-1 text-gray-600">{card.description}</Text>
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
          headerStyle: {
            backgroundColor: configFile.colorGreen,
          },
          headerRight: () => (
            <Pressable onPress={() => router.replace('/login')} style={{ paddingHorizontal: 10 }}>
              <MaterialIcons name="logout" size={24} color="white" />
            </Pressable>
          ),
          headerTintColor: 'white',
        }}
      />

      <ScrollView className="flex-1 p-4">
        {/* Welcome */}
        <View className="mb-3 bg-white p-6">
          <Text className="text-2xl font-bold">Welcome, {role}</Text>
          <Text className="mt-1 text-gray-600">ID: {empId}</Text>
        </View>

        {/* Attendance Shortcut */}
        <Pressable onPress={() => navigateTo('/dashboard/attendance')}>
          <View className="mb-3 flex-row items-center rounded-lg bg-white p-6 shadow-sm">
            <Text className="grow text-2xl font-bold">Mark your Attendance</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </View>
        </Pressable>

        {/* Menu */}
        {menuCards.map(renderMenuCard)}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
