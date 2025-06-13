import { View, Text, Pressable, ScrollView, Modal, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { configFile } from '../../../config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Calendar from '../../../components/Calendar';
import SearchBar from 'components/search';

const RequestsScreen = () => {
  const [activeTab, setActiveTab] = useState('uniform');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [search, setSearch] = useState('');

  // Mock data - replace with actual data
  const uniformRequests = [
    { 
      id: 'UR001', 
      employee: 'John Doe', 
      employeeId: 'EMP001', 
      status: 'Pending', 
      size: 'M', 
      items: ['Shirt', 'Pants'] 
    },
    { 
      id: 'UR002', 
      employee: 'Mike Johnson', 
      employeeId: 'EMP003', 
      status: 'Approved', 
      size: 'L', 
      items: ['Shirt', 'Pants', 'Shoes'] 
    },
  ];

  const leaveRequests = [
    { 
      id: 'LR001', 
      employee: 'Jane Smith', 
      employeeId: 'EMP002', 
      status: 'Pending', 
      type: 'Sick Leave', 
      duration: '3 days' 
    },
    { 
      id: 'LR002', 
      employee: 'Sarah Wilson', 
      employeeId: 'EMP004', 
      status: 'Approved', 
      type: 'Annual Leave', 
      duration: '5 days' 
    },
  ];

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

  const filteredUniformRequests = uniformRequests.filter(req =>
    req.employee.toLowerCase().includes(search.toLowerCase()) ||
    req.employeeId.toLowerCase().includes(search.toLowerCase())
  );
  
  const filteredLeaveRequests = leaveRequests.filter(req =>
    req.employee.toLowerCase().includes(search.toLowerCase()) ||
    req.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const renderRequestCard = (req: any, type: 'uniform' | 'leave', showActions = true) => (
    <View key={req.id} className="mb-4 overflow-hidden rounded-xl bg-white shadow-lg">
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-gray-800">{req.employee}</Text>
            <Text className="text-gray-600">ID: {req.employeeId}</Text>
            {type === 'uniform' ? (
              <>
                <Text className="text-gray-600">Size: {req.size}</Text>
                <View className="mt-2 flex-row flex-wrap gap-2">
                  {req.items.map((item: string, index: number) => (
                    <View key={index} className="rounded-full bg-gray-100 px-3 py-1">
                      <Text className="text-sm text-gray-700">{item}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <>
                <Text className="text-gray-600">Type: {req.type}</Text>
                <Text className="text-gray-600">Duration: {req.duration}</Text>
              </>
            )}
          </View>
          <View className="flex-row gap-2">
            {showActions && (
            <Pressable
              onPress={() => {
                setSelectedRequest(req);
                setShowEditModal(true);
              }}
              className="rounded-full bg-blue-100 p-2"
            >
              <MaterialIcons name="edit" size={20} color="#4A90E2" />
            </Pressable>  
            )}
            {showActions && (
            <Pressable
              onPress={() => {
                setSelectedRequest(req);
                setShowDeleteModal(true);
              }}
              className="rounded-full bg-red-100 p-2"
            >
              <MaterialIcons name="delete" size={20} color="#FF6B6B" />
            </Pressable>
            )}
          </View>
        </View>
        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="mr-2 font-semibold text-gray-700">Status:</Text>
            <View 
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: `${getStatusColor(req.status)}20` }}
            >
              <Text style={{ color: getStatusColor(req.status) }}>{req.status}</Text>
            </View>
          </View>
          {req.status === 'Pending' && (
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => {
                  // Handle approve
                }}
                className="rounded-lg bg-green-500 px-4 py-2"
              >
                <Text className="text-white">Approve</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  // Handle reject
                }}
                className="rounded-lg bg-red-500 px-4 py-2"
              >
                <Text className="text-white">Reject</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderAddModal = () => (
    <Modal
      visible={showAddModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowAddModal(false)}
    >
      <TouchableOpacity 
        className="flex-1 justify-end bg-black/50"
        activeOpacity={1}
        onPress={() => setShowAddModal(false)}
      >
        <TouchableOpacity activeOpacity={1} onPress={e => e.stopPropagation()}>
          <View className="rounded-t-3xl bg-white p-6">
            <Text className="mb-4 text-xl font-bold">
              Add {activeTab === 'uniform' ? 'Uniform' : 'Leave'} Request
            </Text>
            {/* Add form fields here */}
            <View className="flex-row justify-end gap-2">
              <Pressable
                onPress={() => setShowAddModal(false)}
                className="rounded-lg bg-gray-200 px-4 py-2"
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  // Handle add request
                  setShowAddModal(false);
                }}
                className="rounded-lg bg-blue-500 px-4 py-2"
              >
                <Text className="text-white">Add</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowEditModal(false)}
    >
      <TouchableOpacity 
        className="flex-1 justify-end bg-black/50"
        activeOpacity={1}
        onPress={() => setShowEditModal(false)}
      >
        <TouchableOpacity activeOpacity={1} onPress={e => e.stopPropagation()}>
          <View className="rounded-t-3xl bg-white p-6">
            <Text className="mb-4 text-xl font-bold">
              Edit {activeTab === 'uniform' ? 'Uniform' : 'Leave'} Request
            </Text>
            {/* Edit form fields here */}
            <View className="flex-row justify-end gap-2">
              <Pressable
                onPress={() => setShowEditModal(false)}
                className="rounded-lg bg-gray-200 px-4 py-2"
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  // Handle edit request
                  setShowEditModal(false);
                }}
                className="rounded-lg bg-blue-500 px-4 py-2"
              >
                <Text className="text-white">Save</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  const renderDeleteModal = () => (
    <Modal
      visible={showDeleteModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowDeleteModal(false)}
    >
      <TouchableOpacity 
        className="flex-1 justify-end bg-black/50"
        activeOpacity={1}
        onPress={() => setShowDeleteModal(false)}
      >
        <TouchableOpacity activeOpacity={1} onPress={e => e.stopPropagation()}>
          <View className="rounded-t-3xl bg-white p-6">
            <Text className="mb-4 text-xl font-bold">Delete Request</Text>
            <Text className="mb-4 text-gray-600">
              Are you sure you want to delete this request?
            </Text>
            <View className="flex-row justify-end gap-2">
              <Pressable
                onPress={() => setShowDeleteModal(false)}
                className="rounded-lg bg-gray-200 px-4 py-2"
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  // Handle delete request
                  setShowDeleteModal(false);
                }}
                className="rounded-lg bg-red-500 px-4 py-2"
              >
                <Text className="text-white">Delete</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Requests',
          headerStyle: {
            backgroundColor: configFile.colorGreen,
          },
          headerTintColor: 'white',
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable onPress={() => setShowFilterModal(true)} style={{ marginRight: 16 }}>
                <MaterialIcons name="filter-list" size={24} color="white" />
              </Pressable>
              <Pressable onPress={() => setShowAddModal(true)}>
                <MaterialIcons name="add" size={24} color="white" />
              </Pressable>
            </View>
          ),
        }} 
      />
      <SearchBar value={search} onChangeText={setSearch} placeholder="Search employee..." />
      <View className="flex-row justify-around rounded-2xl bg-gray-200 p-0.5 mx-4 my-4">
        <Pressable onPress={() => setActiveTab('uniform')}>
          <View
            className={`rounded-3xl p-3 px-6 ${activeTab === 'uniform' ? `bg-[${configFile.colorGreen}]` : ''}`}
            style={{ borderRadius: 12 }}>
            <Text
              className={`text-lg font-semibold ${activeTab !== 'uniform' ? 'text-black' : 'text-white'}`}>
              Uniform Request
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={() => setActiveTab('leave')}>
          <View
            className={`rounded-3xl p-3 px-6 ${activeTab === 'leave' ? `bg-[${configFile.colorGreen}]` : ''}`}
            style={{ borderRadius: 12 }}>
            <Text
              className={`text-lg font-semibold ${activeTab !== 'leave' ? 'text-black' : 'text-white'}`}>
              Leave Request
            </Text>
          </View>
        </Pressable>
      </View>

      {/* <ScrollView className="flex-1 px-4">
        {activeTab === 'uniform' 
          ? uniformRequests.map(req => renderRequestCard(req, 'uniform'))
          : leaveRequests.map(req => renderRequestCard(req, 'leave'))
        }
      </ScrollView> */}
      <ScrollView className="flex-1 px-4">
  {activeTab === 'uniform' 
    ? filteredUniformRequests.map(req => renderRequestCard(req, 'uniform'))
    : filteredLeaveRequests.map(req => renderRequestCard(req, 'leave'))
  }
</ScrollView>

      {renderAddModal()}
      {renderEditModal()}
      {renderDeleteModal()}

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
          <TouchableOpacity activeOpacity={1} onPress={e => e.stopPropagation()} style={{ height: '90%' }}>
            <View className="rounded-t-1xl bg-white p-6 flex-1">
              <View className="flex-row justify-around rounded-2xl bg-gray-200 p-0.5 mb-4">
                <Pressable onPress={() => setActiveTab('uniform')} style={{ flex: 1 }}>
                  <View
                    style={{
                      borderRadius: 12,
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      backgroundColor: activeTab === 'uniform' ? configFile.colorGreen : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: activeTab === 'uniform' ? 'white' : 'black',
                      }}
                    >
                      Uniform Request
                    </Text>
                  </View>
                </Pressable>
                <Pressable onPress={() => setActiveTab('leave')} style={{ flex: 1 }}>
                  <View
                    style={{
                      borderRadius: 12,
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      backgroundColor: activeTab === 'leave' ? configFile.colorGreen : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: activeTab === 'leave' ? 'white' : 'black',
                      }}
                    >
                      Leave Request
                    </Text>
                  </View>
                </Pressable>
              </View>
              <ScrollView className="flex-1">
                {activeTab === 'uniform'
                  ? uniformRequests.filter(r => r.status === 'Approved').map(req => renderRequestCard(req, 'uniform'))
                  : leaveRequests.filter(r => r.status === 'Approved').map(req => renderRequestCard(req, 'leave'))
                }
              </ScrollView>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default RequestsScreen; 