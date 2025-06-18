import React from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { configFile } from '../../../config';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const router = useRouter();

  const handleMenuPress = (route: string) => {
    router.push(route);
  };

  const menuCards = [
    {
      title: 'Employees',
      icon: 'people',
      route: '/employees',
      color: '#4A90E2',
      description: 'Manage employee information and records',
      onPress: () => handleMenuPress('/employees')
    },
    {
      title: 'Requests',
      icon: 'document-text',
      route: '/requests',
      color: '#50C878',
      description: 'Handle uniform and leave requests',
      onPress: () => handleMenuPress('/requests')
    },
    {
      title: 'Clients',
      icon: 'business',
      route: '/clients',
      color: '#FF6B6B',
      description: 'Manage client information and status',
      onPress: () => handleMenuPress('/clients')
    },
    {
      title: 'Payroll',
      icon: 'cash',
      route: '/payroll',
      color: '#4A90E2',
      description: 'Monthly wise payroll and download',
      onPress: () => handleMenuPress('/payroll')
    },
    {
      title: 'Employee ID Card',
      icon: 'card',
      route: '/employeeIdCard',
      color: '#50C878',
      description: 'View and generate employee ID cards',
      onPress: () => handleMenuPress('/employeeIdCard')
    },
    {
      title: 'Attendance',
      icon: 'calendar',
      route: '/attendance',
      color: '#FF6B6B',
      description: 'View employee attendance details',
      onPress: () => handleMenuPress('/attendance')
    }
  ];

  const renderMenuCard = (card: any) => (
    <Pressable
      key={card.title}
      onPress={card.onPress}
      className="bg-white rounded-lg p-6 mb-4 shadow-sm"
    >
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: `${card.color}20` }}
        >
          <Ionicons name={card.icon} size={24} color={card.color} />
        </View>
        <View className="flex-1">
          <Text className="text-xl font-semibold">{card.title}</Text>
          <Text className="text-gray-600 mt-1">{card.description}</Text>
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
          headerTintColor: 'white',
        }} 
      />

      <ScrollView className="flex-1 p-4">
        {/* Welcome Card */}
        <View className="bg-white p-6 mb-3">
          <Text className="text-2xl font-bold">Welcome, Super Admin</Text>
          <Text className="text-gray-600 mt-1">ID: ADMIN001</Text>
        </View>

        {/* Menu Cards */}
        {menuCards.map(renderMenuCard)}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;