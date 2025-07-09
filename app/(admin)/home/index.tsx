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

  useEffect(() => {
    const fetchEmpData = async () => {
      try {
        const response = await Api.getEmpData(String(empId));
        if (response) {
          State.storeEmpData(response);
          setEmpData(response);
        }
      } catch (error) {
        console.error('Error fetching emp data:', error);
      }
    };

    fetchEmpData();
    NavRouter.BackHandler({ role, empId });
  }, [empId]);

  const menuCards = useMemo(
    () => [
      {
        key: 'employees',
        title: 'Employees',
        icon: 'people',
        description: 'Manage employee records',
        color: '#6a11cb',
        route: '/employees',
      },
      {
        key: 'requests',
        title: 'Requests',
        icon: 'document-text',
        description: 'Manage uniform & leave requests',
        color: '#43cea2',
        route: '/requests',
      },
      {
        key: 'clients',
        title: 'Clients',
        icon: 'business',
        description: 'Handle client data',
        color: '#ff512f',
        route: '/clients',
      },
      {
        key: 'attendance',
        title: 'Attendance',
        icon: 'calendar',
        description: 'View attendance logs',
        color: '#00c6ff',
        route: '/attendance',
      },
      {
        key: 'payslip',
        title: 'Pay Slip',
        icon: 'cash',
        description: 'Access payslip info',
        color: '#f7971e',
        route: '/emp-plugins/pay_slip',
      },
      {
        key: 'leave_request',
        title: 'Leave Request',
        icon: 'holiday-village',
        isFontisto: true,
        description: 'Apply for leave',
        color: '#00b09b',
        route: '/emp-plugins/leave_request',
      },
      {
        key: 'uniform_request',
        title: 'Uniform Request',
        icon: 'shirt',
        description: 'Raise Uniform Request for Employees',
        color: '#b92b27',
        route: '/emp-plugins/uniform_request',
      },
    ],
    [navigateTo]
  );

  const renderMenuCard = ({ key, icon, title, description, color, route, isFontisto }: any) => (
    <Pressable
      key={key}
      onPress={() => navigateTo(route)}
      className="mb-6 rounded-2xl bg-white p-5 shadow-md"
      style={{
        borderLeftWidth: 6,
        borderLeftColor: color,
        elevation: 4,
      }}>
      <View className="flex-row items-center">
        <View
          className="mr-4 h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: '#f4f4f4' }}>
          {isFontisto ? (
            <Fontisto name={icon} size={20} color={color} />
          ) : (
            <Ionicons name={icon} size={24} color={color} />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{title}</Text>
          <Text className="mt-1 text-sm text-gray-600">{description}</Text>
        </View>
        <Ionicons name="chevron-forward-circle-outline" size={22} color={color} />
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Dashboard',
          headerStyle: {
            backgroundColor: configFile.colorGreen,
            elevation: 10,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
          },
          headerRight: () => (
            <View className="flex flex-row gap-4 pr-3">
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

      <ScrollView className="flex-1 px-4 pt-4">
        {empData && (
          <DashTop role={''} name={empData.name} empId={empId} img={empData.profile_image} />
        )}

        {/* Quick Action Card */}
        <Pressable
          onPress={() => navigateTo('/(tabs)/dashboard/attendance')}
          className="mb-6 flex-row items-center justify-between rounded-2xl bg-white p-5 shadow-md"
          style={{
            borderWidth: 1,
            borderColor: '#e2e8f0',
            elevation: 4,
          }}>
          <View>
            <Text className="mb-1 text-sm font-medium text-gray-500">Quick Action</Text>
            <View className="flex-row gap-1.5">
              <Text className="text-xl font-bold text-gray-800">Mark</Text>
              <Text className="text-xl font-bold" style={{ color: configFile.colorGreen }}>
                Attendance
              </Text>
            </View>
          </View>
          <View className="rounded-full bg-[#e0f7f1] p-3 shadow-sm">
            <FontAwesome name="calendar-check-o" size={22} color="#1abc9c" />
          </View>
        </Pressable>

        {menuCards.map(renderMenuCard)}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
