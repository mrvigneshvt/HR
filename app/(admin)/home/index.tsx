import { View, Text, Pressable, ScrollView, Modal, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { configFile } from '../../../config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showRequestLogsModal, setShowRequestLogsModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeRequestTab, setActiveRequestTab] = useState('uniform');

  // Mock data - replace with actual data
  const employees = [
    { id: 'EMP001', name: 'John Doe', location: 'Chennai', requests: ['Leave', 'Uniform'] },
    { id: 'EMP002', name: 'Jane Smith', location: 'Bangalore', requests: ['Leave'] },
  ];

  const uniformRequests = [
    { id: 'UR001', employee: 'John Doe', employeeId: 'EMP001', status: 'Pending', size: 'M', items: ['Shirt', 'Pants'] },
    { id: 'UR002', employee: 'Mike Johnson', employeeId: 'EMP003', status: 'Approved', size: 'L', items: ['Shirt', 'Pants', 'Shoes'] },
  ];

  const leaveRequests = [
    { id: 'LR001', employee: 'Jane Smith', employeeId: 'EMP002', status: 'Pending', type: 'Sick Leave', duration: '3 days' },
    { id: 'LR002', employee: 'Sarah Wilson', employeeId: 'EMP004', status: 'Approved', type: 'Annual Leave', duration: '5 days' },
  ];

  const clients = [
    { id: 'CLI001', name: 'ABC Corp', location: 'Mumbai' },
    { id: 'CLI002', name: 'XYZ Ltd', location: 'Delhi' },
  ];

  // Monthly data - replace with actual data
  const monthlyData = {
    employees: [
      { id: 'EMP001', name: 'John Doe', location: 'Chennai', requests: ['Leave'], month: 'March' },
      { id: 'EMP002', name: 'Jane Smith', location: 'Bangalore', requests: ['Uniform'], month: 'March' },
    ],
    uniformRequests: [
      { id: 'UR001', employee: 'John Doe', employeeId: 'EMP001', status: 'Pending', size: 'M', items: ['Shirt', 'Pants'], month: 'March' },
    ],
    leaveRequests: [
      { id: 'LR001', employee: 'Jane Smith', employeeId: 'EMP002', status: 'Pending', type: 'Sick Leave', duration: '3 days', month: 'March' },
    ],
    clients: [
      { id: 'CLI001', name: 'ABC Corp', location: 'Mumbai', month: 'March' },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FFA500';
      case 'approved':
        return configFile.colorGreen;
      case 'rejected':
        return '#FF0000';
      default:
        return '#666666';
    }
  };

  const renderEmployeeCard = (emp: any) => (
    <View key={emp.id} className="mb-4 overflow-hidden rounded-xl bg-white shadow-lg">
      <View className="border-b border-gray-100 p-4">
        <Text className="text-md font-bold text-gray-600">Employee Name: {emp.name}</Text>
        <Text className="mt-1 text-gray-600">Employee ID: {emp.id}</Text>
        <Text className="text-gray-600">Location: {emp.location}</Text>
      </View>
      <View className="p-4">
        <Text className="mb-2 font-semibold text-gray-700">Request for:</Text>
        <View className="flex-row flex-wrap gap-2">
          {emp.requests.map((req: string, index: number) => (
            <View 
              key={index} 
              className="rounded-full px-4 py-2"
              style={{ backgroundColor: req === 'Leave' ? '#FFE4E1' : '#E6F3FF' }}
            >
              <Text 
                className="font-medium"
                style={{ color: req === 'Leave' ? '#FF6B6B' : '#4A90E2' }}
              >
                {req}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderRequestCard = (req: any, type: 'uniform' | 'leave') => (
    <View key={req.id} className="mb-4 overflow-hidden rounded-xl bg-white shadow-lg">
      <View className="border-b border-gray-100 p-4">
        <Text className="mt-1 text-gray-600">Employee: {req.employee}</Text>
        <Text className="text-gray-600">Employee ID: {req.employeeId}</Text>
      </View>
      <View className="p-4">
        {type === 'uniform' ? (
          <>
            <Text className="mb-2 text-gray-600">Size: {req.size}</Text>
            <View className="flex-row flex-wrap gap-2">
              {req.items.map((item: string, index: number) => (
                <View key={index} className="rounded-full bg-gray-100 px-3 py-1">
                  <Text className="text-sm text-gray-700">{item}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text className="mb-2 text-gray-600">Type: {req.type}</Text>
            <Text className="text-gray-600">Duration: {req.duration}</Text>
          </>
        )}
        <View className="mt-3 flex-row items-center">
          <Text className="mr-2 font-semibold text-gray-700">Status:</Text>
          <View 
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: `${getStatusColor(req.status)}20` }}
          >
            <Text style={{ color: getStatusColor(req.status) }}>{req.status}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderFilterContent = () => {
    const data = selectedFilter === 'all' 
      ? { employees, uniformRequests, leaveRequests, clients }
      : monthlyData;

    return (
      <ScrollView className="max-h-96">
        <View className="mb-4">
          <Text className="mb-2 text-lg font-bold text-gray-700">Employees</Text>
          {data.employees.map(renderEmployeeCard)}
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-lg font-bold text-gray-700">Uniform Requests</Text>
          {data.uniformRequests.map(req => renderRequestCard(req, 'uniform'))}
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-lg font-bold text-gray-700">Leave Requests</Text>
          {data.leaveRequests.map(req => renderRequestCard(req, 'leave'))}
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-lg font-bold text-gray-700">Clients</Text>
          {data.clients.map((client) => (
            <View key={client.id} className="mb-4 overflow-hidden rounded-xl bg-white shadow-lg">
              <View className="border-b border-gray-100 p-4">
                <Text className="text-xl font-bold" style={{ color: configFile.colorGreen }}>{client.name}</Text>
                <Text className="mt-1 text-gray-600">ID: {client.id}</Text>
                <Text className="text-gray-600">Location: {client.location}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'employees':
        return (
          <ScrollView className="flex-1 p-4">
            {employees.map(renderEmployeeCard)}
          </ScrollView>
        );
      case 'requests':
        return (
          <View className="flex-1">
            <View className="flex-row justify-around rounded-2xl bg-gray-200 p-0.5 mx-4 my-4">
              <Pressable onPress={() => setActiveRequestTab('uniform')}>
                <View
                  className={`rounded-3xl p-3 px-6 ${activeRequestTab === 'uniform' ? `bg-[${configFile.colorGreen}]` : ''}`}
                  style={{ borderRadius: 12 }}>
                  <Text
                    className={`text-lg font-semibold ${activeRequestTab !== 'uniform' ? 'text-black' : 'text-white'}`}>
                    Uniform Request
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={() => setActiveRequestTab('leave')}>
                <View
                  className={`rounded-3xl p-3 px-6 ${activeRequestTab === 'leave' ? `bg-[${configFile.colorGreen}]` : ''}`}
                  style={{ borderRadius: 12 }}>
                  <Text
                    className={`text-lg font-semibold ${activeRequestTab !== 'leave' ? 'text-black' : 'text-white'}`}>
                    Leave Request
                  </Text>
                </View>
              </Pressable>
            </View>
            <ScrollView className="flex-1 px-4">
              {activeRequestTab === 'uniform' 
                ? uniformRequests.map(req => renderRequestCard(req, 'uniform'))
                : leaveRequests.map(req => renderRequestCard(req, 'leave'))
              }
            </ScrollView>
          </View>
        );
      case 'clients':
        return (
          <ScrollView className="flex-1 p-4">
            {clients.map((client) => (
              <View key={client.id} className="mb-4 overflow-hidden rounded-xl bg-white shadow-lg">
                <View className="border-b border-gray-100 p-4">
                  <Text className="text-xl font-bold" style={{ color: configFile.colorGreen }}>{client.name}</Text>
                  <Text className="mt-1 text-gray-600">ID: {client.id}</Text>
                  <Text className="text-gray-600">Location: {client.location}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        );
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Home',
          headerStyle: {
            backgroundColor: configFile.colorGreen,
          },
          headerTintColor: 'white',
          headerRight: () => (
            <View className="flex-row gap-4">
              <Pressable onPress={() => setShowRequestLogsModal(true)}>
                <Ionicons name="list" size={24} color="white" />
              </Pressable>
              <Pressable onPress={() => setShowFilterModal(true)}>
                <MaterialIcons name="filter-list" size={24} color="white" />
              </Pressable>
            </View>
          ),
        }} 
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity 
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={e => e.stopPropagation()}>
            <View className="rounded-t-3xl bg-white p-6">
              <Text className="mb-4 text-xl font-bold">Filter</Text>
              <View className="mb-4 flex-row justify-around rounded-2xl bg-gray-200 p-0.5">
                <Pressable
                  onPress={() => setSelectedFilter('all')}
                >
                  <View
                    className={`rounded-2xl p-3 px-6 ${selectedFilter === 'all' ? `bg-[${configFile.colorGreen}]` : ''}`}
                    style={{ borderRadius: 10 }}>
                    <Text
                      className={`text-lg font-semibold ${selectedFilter !== 'all' ? 'text-black' : 'text-white'}`}>
                      All
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => setSelectedFilter('monthly')}
                >
                  <View
                    className={`rounded-2xl p-3 px-6 ${selectedFilter === 'monthly' ? `bg-[${configFile.colorGreen}]` : ''}`}
                    style={{ borderRadius: 10 }}>
                    <Text
                      className={`text-lg font-semibold ${selectedFilter !== 'monthly' ? 'text-black' : 'text-white'}`}>
                      Monthly Wise
                    </Text>
                  </View>
                </Pressable>
              </View>
              <Text className='text-gray-600 text-center'>UI OnProgress</Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Request Logs Modal */}
      <Modal
        visible={showRequestLogsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRequestLogsModal(false)}
      >
        <TouchableOpacity 
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setShowRequestLogsModal(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={e => e.stopPropagation()}>
            <View className="rounded-t-3xl bg-white p-6">
              <Text className="mb-4 text-xl font-bold">Request Logs</Text>
              <ScrollView 
                className="max-h-96"
                showsVerticalScrollIndicator={false}
              >
                {[...uniformRequests, ...leaveRequests].map((req, index) => (
                  <View key={index} className="mb-3 overflow-hidden rounded-xl border border-gray-200">
                    <View className="border-b border-gray-100 bg-gray-50 p-4">
                      <Text className="text-lg font-semibold">
                        {'type' in req ? 'Leave Request' : 'Uniform Request'}
                      </Text>
                      <Text className="text-gray-600">{req.employee}</Text>
                      <Text className="text-gray-600">ID: {req.employeeId}</Text>
                    </View>
                    <View className="p-4">
                      <View className="flex-row items-center">
                        <Text className="mr-2 font-semibold text-gray-700">Status:</Text>
                        <View 
                          className="rounded-full px-3 py-1"
                          style={{ backgroundColor: `${getStatusColor(req.status)}20` }}
                        >
                          <Text style={{ color: getStatusColor(req.status) }}>{req.status}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 bg-white">
        <Pressable
          className={`flex-1 p-4 ${activeTab === 'employees' ? 'border-b-2' : ''}`}
          style={activeTab === 'employees' ? { borderBottomColor: configFile.colorGreen } : {}}
          onPress={() => setActiveTab('employees')}
        >
          <Text
            className="text-center text-base font-semibold"
            style={{ color: activeTab === 'employees' ? configFile.colorGreen : '#666' }}
          >
            Employees
          </Text>
        </Pressable>
        <Pressable
          className={`flex-1 p-4 ${activeTab === 'requests' ? 'border-b-2' : ''}`}
          style={activeTab === 'requests' ? { borderBottomColor: configFile.colorGreen } : {}}
          onPress={() => setActiveTab('requests')}
        >
          <Text
            className="text-center text-base font-semibold"
            style={{ color: activeTab === 'requests' ? configFile.colorGreen : '#666' }}
          >
            Requests
          </Text>
        </Pressable>
        <Pressable
          className={`flex-1 p-4 ${activeTab === 'clients' ? 'border-b-2' : ''}`}
          style={activeTab === 'clients' ? { borderBottomColor: configFile.colorGreen } : {}}
          onPress={() => setActiveTab('clients')}
        >
          <Text
            className="text-center text-base font-semibold"
            style={{ color: activeTab === 'clients' ? configFile.colorGreen : '#666' }}
          >
            Clients
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      {renderContent()}
    </View>
  );
};

export default HomeScreen;
