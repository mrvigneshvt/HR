import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { configFile } from '../../../config';
import { Api } from 'class/HandleApi';
import { State } from 'class/State';
import { NavRouter } from 'class/Router';
import DashTop from 'components/DashTop';

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
        description: 'Manage employee records',
        color: '#4A90E2',
        route: '/employees',
      },
      {
        key: 'requests',
        title: 'Requests',
        icon: 'document-text',
        description: 'Manage uniform & leave requests',
        color: '#50C878',
        route: '/requests',
      },
      {
        key: 'clients',
        title: 'Clients',
        icon: 'business',
        description: 'Handle client data',
        color: '#FF6B6B',
        route: '/clients',
      },
      {
        key: 'attendance',
        title: 'Attendance',
        icon: 'calendar',
        description: 'View attendance logs',
        color: '#FFA500',
        route: '/attendance',
      },
      {
        key: 'payslip',
        title: 'Pay Slip',
        icon: 'cash',
        description: 'Access payslip info',
        color: '#6A5ACD',
        route: '/emp-plugins/pay_slip',
      },
      {
        key: 'leave_request',
        title: 'Leave Request',
        icon: 'holiday-village',
        isFontisto: true,
        description: 'Apply for leave',
        color: '#2E8B57',
        route: '/emp-plugins/leave_request',
      },
    ],
    [navigateTo]
  );

  const renderMenuCard = ({ key, icon, title, description, color, route, isFontisto }: any) => (
    <Pressable
      key={key}
      onPress={() => navigateTo(route)}
      className="mb-4 rounded-2xl bg-white p-5 shadow-md">
      <View className="flex-row items-center">
        <View
          className="mr-4 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}20` }}>
          {isFontisto ? (
            <Fontisto name={icon} size={22} color={color} />
          ) : (
            <Ionicons name={icon} size={24} color={color} />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">{title}</Text>
          <Text className="mt-1 text-sm text-gray-600">{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#ccc" />
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Dashboard',
          headerStyle: { backgroundColor: configFile.colorGreen },
          headerTintColor: 'white',
          headerRight: () => (
            <View className="flex flex-row gap-3 pr-3">
              <TouchableOpacity onPress={() => router.push('/emp-plugins/notification')}>
                <Ionicons name="notifications" size={24} color="#fff" />
              </TouchableOpacity>
              <Pressable onPress={() => router.replace('/login')}>
                <MaterialIcons name="logout" size={24} color="#fff" />
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView className="flex-1 p-4">
        {empData && (
          <DashTop role={''} name={empData.name} empId={empId} img={empData.profile_image} />
        )}

        {role && (
          <Pressable onPress={() => navigateTo('/(tabs)/dashboard/attendance')}>
            <View className="mb-4 flex-row items-center justify-between rounded-xl bg-white p-5 shadow-md">
              <View>
                <Text className="text-lg font-semibold text-gray-800">Mark your</Text>
                <Text className={`text-xl font-bold text-[${configFile.colorGreen}]`}>
                  Attendance
                </Text>
              </View>
              <View className="rounded-full p-3" style={{ backgroundColor: configFile.colorGreen }}>
                <FontAwesome name="calendar-check-o" size={22} color="white" />
              </View>
            </View>
          </Pressable>
        )}

        {menuCards.map(renderMenuCard)}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
