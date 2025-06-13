import { View, Text, Pressable, ScrollView, Modal, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { configFile } from '../../../config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import SearchBar from 'components/search';

const ClientsScreen = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [search, setSearch] = useState('');
  // Mock data - replace with actual data
  const clients = [
    { id: 'EMP001', name: 'John Doe', location: 'Chennai' },
    { id: 'EMP002', name: 'Jane Smith', location: 'Bangalore' },
  ];

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.id.toLowerCase().includes(search.toLowerCase()) ||
      client.location.toLowerCase().includes(search.toLowerCase())
  );

  const renderClientCard = (emp: any, showActions = true) => (
    <View key={emp.id} className="mb-4 overflow-hidden rounded-xl bg-white shadow-lg">
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-gray-800">{emp.name}</Text>
            <Text className="text-gray-600">ID: {emp.id}</Text>
            <Text className="text-gray-600">Location: {emp.location}</Text>
          </View>
          <View className="flex-row gap-2">
            {showActions && (
              <>
                <Pressable
                  onPress={() => {
                    setSelectedEmployee(emp);
                    setShowEditModal(true);
                  }}
                  className="rounded-full bg-blue-100 p-2">
                  <MaterialIcons name="edit" size={20} color="#4A90E2" />
                </Pressable>
                <Pressable
                  onPress={() => {
                    setSelectedEmployee(emp);
                    setShowDeleteModal(true);
                  }}
                  className="rounded-full bg-red-100 p-2">
                  <MaterialIcons name="delete" size={20} color="#FF6B6B" />
                </Pressable>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  const renderAddModal = () => (
    <Modal
      visible={showAddModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowAddModal(false)}>
      <TouchableOpacity
        className="flex-1 justify-end bg-black/50"
        activeOpacity={1}
        onPress={() => setShowAddModal(false)}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View className="rounded-t-3xl bg-white p-6">
            <Text className="mb-4 text-xl font-bold">Add Clients</Text>
            {/* Add form fields here */}
            <View className="flex-row justify-end gap-2">
              <Pressable
                onPress={() => setShowAddModal(false)}
                className="rounded-lg bg-gray-200 px-4 py-2">
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  // Handle add employee
                  setShowAddModal(false);
                }}
                className="rounded-lg bg-blue-500 px-4 py-2">
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
      onRequestClose={() => setShowEditModal(false)}>
      <TouchableOpacity
        className="flex-1 justify-end bg-black/50"
        activeOpacity={1}
        onPress={() => setShowEditModal(false)}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View className="rounded-t-3xl bg-white p-6">
            <Text className="mb-4 text-xl font-bold">Edit Clients</Text>
            {/* Edit form fields here */}
            <View className="flex-row justify-end gap-2">
              <Pressable
                onPress={() => setShowEditModal(false)}
                className="rounded-lg bg-gray-200 px-4 py-2">
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  // Handle edit employee
                  setShowEditModal(false);
                }}
                className="rounded-lg bg-blue-500 px-4 py-2">
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
      onRequestClose={() => setShowDeleteModal(false)}>
      <TouchableOpacity
        className="flex-1 justify-end bg-black/50"
        activeOpacity={1}
        onPress={() => setShowDeleteModal(false)}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View className="rounded-t-3xl bg-white p-6">
            <Text className="mb-4 text-xl font-bold">Delete Clients</Text>
            <Text className="mb-4 text-gray-600">
              Are you sure you want to delete {selectedEmployee?.name}?
            </Text>
            <View className="flex-row justify-end gap-2">
              <Pressable
                onPress={() => setShowDeleteModal(false)}
                className="rounded-lg bg-gray-200 px-4 py-2">
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  // Handle delete employee
                  setShowDeleteModal(false);
                }}
                className="rounded-lg bg-red-500 px-4 py-2">
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
          title: 'Clients',
          headerStyle: {
            backgroundColor: configFile.colorGreen,
          },
          headerTintColor: 'white',
          // headerRight: () => (
          //   <Pressable onPress={() => setShowAddModal(true)}>
          //     <MaterialIcons name="add" size={24} color="white" />
          //   </Pressable>
          // ),
        }}
      />
      <SearchBar value={search} onChangeText={setSearch} placeholder="Search client..." />
      <ScrollView className="flex-1 p-4">
        {filteredClients.map((emp) =>
          renderClientCard(emp, !showAddModal && !showEditModal && !showDeleteModal)
        )}
      </ScrollView>
      {renderAddModal()}
      {renderEditModal()}
      {renderDeleteModal()}
    </View>
  );
};

export default ClientsScreen;
