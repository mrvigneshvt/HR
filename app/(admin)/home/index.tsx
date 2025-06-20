import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { configFile } from '../../../config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const router = useRouter();
  const { role, empId } = useLocalSearchParams();
  console.log(role, '/rollle///empId', empId);

  const handleClientsPress = () => {
    router.push({
      pathname: '/clients',
      params: {
        role,
        empId,
      },
    });
  };

  const handleEmployeePress = () => {
    router.push({
      pathname: '/employees',
      params: {
        role,
        empId,
      },
    });
  };

  const handleRequestPress = () => {
    router.push({
      pathname: '/requests',
      params: {
        role,
        empId,
      },
    });
  };

  const handleAttendancePress = () => {
    router.push({
      pathname: '/attendance',
      params: {
        role,
        empId,
      },
    });
  };

  const handleEmployeeIdPRess = () => {
    router.push({
      pathname: '/employeeIdCard',
      params: {
        role,
        empId,
      },
    });
  };

  const handlePayrollPress = () => {
    router.push({
      pathname: '/payroll',
      params: {
        role,
        empId,
      },
    });
  };
  const [menuCards] = useState<Record<string, any>[]>([
    {
      title: 'Employees',
      icon: 'people',
      route: '/employees',
      color: '#4A90E2',
      description: 'Manage employethile information and records',
      onPress: handleEmployeePress,
      role,
    },
    {
      title: 'Requests',
      icon: 'document-text',
      route: '/requests',
      color: '#50C878',
      description: 'Handle uniform and leave requests',
      onPress: handleRequestPress,
      role,
    },
    {
      title: 'Clients',
      icon: 'business',
      route: '/clients',
      color: '#FF6B6B',
      description: 'Manage client information and status',
      onPress: handleClientsPress,
      role,
    },
    {
      title: 'Payroll',
      icon: 'cash',
      route: '/payroll',
      color: '#4A90E2',
      description: 'Monthly wise payroll and download',
      onPress: handlePayrollPress,
      role,
    },
    {
      title: 'Employee ID Card',
      icon: 'card',
      route: '/employeeIdCard',
      color: '#50C878',
      description: 'View and generate employee ID cards',
      onPress: handleEmployeeIdPRess,
      role,
    },
    {
      title: 'Attendance',
      icon: 'calendar',
      route: '/attendance',
      color: '#FF6B6B',
      description: 'View employee attendance details',
      onPress: handleAttendancePress,
      role,
    },
  ]);

  // useEffect(() => {}, []);

  // let menuCards =;

  const renderMenuCard = (card: any) => (
    <Pressable
      key={card.title}
      onPress={card.onPress || (() => router.replace({ pathname: card.route, params: card.role }))}
      className="mb-4 rounded-lg bg-white p-6 shadow-sm">
      <View className="flex-row items-center">
        <View
          className="mr-4 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: `${card.color}20` }}>
          <Ionicons name={card.icon} size={24} color={card.color} />
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
            <>
              <Pressable
                className=""
                onPress={() => {
                  console.log('invoking logout');
                  router.replace('/login');
                }}>
                <MaterialIcons name="logout" size={24} color="black" />
              </Pressable>
            </>
          ),
          headerTintColor: 'white',
        }}
      />

      <ScrollView className="flex-1 p-4">
        {/* Welcome Card */}
        <View className="mb-3 bg-white p-6">
          <Text className="text-2xl font-bold">
            Welcome, {role}
            {}
          </Text>
          <Text className="mt-1 text-gray-600">ID: {empId}</Text>
        </View>
        <Pressable
          onPress={() =>
            router.replace({
              pathname: '/dashboard/attendance',
              params: {
                role,
                empId,
              },
            })
          }>
          <View className="mb-3 flex-row items-center bg-white p-6">
            <Text className="grow text-2xl font-bold">Mark, Your Attendence Here</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </View>
        </Pressable>

        {/* Menu Cards */}
        {menuCards.map(renderMenuCard)}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
