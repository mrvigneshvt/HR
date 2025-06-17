import { View, Text, Pressable, ScrollView, Modal, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { configFile } from '../../../config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import SearchBar from 'components/search';
import { clientService, Client } from '../../../services/clientService';
import { validateClientForm, ValidationErrors } from '../../../utils/validation';

const ClientsScreen = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({
    clientName: '',
    companyName: '',
    phoneNumber: '',
    gstNumber: '',
    site: '',
    branch: '',
    address: '',
    location: '',
    latitude: '',
    longitude: '',
    status: 'Active',
    checkIn: '',
    lunch_time: '',
    check_out: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientService.getAllClients();
      setClients(response.clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Client, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (isEdit: boolean) => {
    const validationErrors = validateClientForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      if (isEdit && selectedClient?.id) {
        await clientService.updateClient(selectedClient.id, formData as Omit<Client, 'id'>);
      } else {
        await clientService.addClient(formData as Omit<Client, 'id'>);
      }
      await fetchClients();
      setShowAddModal(false);
      setShowEditModal(false);
      setFormData({
        clientName: '',
        companyName: '',
        phoneNumber: '',
        gstNumber: '',
        site: '',
        branch: '',
        address: '',
        location: '',
        latitude: '',
        longitude: '',
        status: 'Active',
        checkIn: '',
        lunch_time: '',
        check_out: ''
      });
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClient?.id) return;
    try {
      setLoading(true);
      await clientService.deleteClient(selectedClient.id);
      await fetchClients();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting client:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.clientName.toLowerCase().includes(search.toLowerCase()) ||
      client.companyName.toLowerCase().includes(search.toLowerCase()) ||
      client.location.toLowerCase().includes(search.toLowerCase())
  );

  const renderFormField = (label: string, field: keyof Client, placeholder: string, keyboardType: 'default' | 'numeric' = 'default') => (
    <View className="mb-4">
      <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
      <TextInput
        className={`rounded-lg border p-2 ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
      {errors[field] && <Text className="mt-1 text-sm text-red-500">{errors[field]}</Text>}
    </View>
  );

  const renderClientCard = (client: Client) => (
    <View key={client.id} className="mb-4 overflow-hidden rounded-xl bg-white shadow-lg">
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-gray-800">{client.clientName}</Text>
            <Text className="text-gray-600">Company: {client.companyName}</Text>
            <Text className="text-gray-600">Location: {client.location}</Text>
            <Text className="text-gray-600">Status: {client.status}</Text>
          </View>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => {
                setSelectedClient(client);
                setFormData(client);
                setShowEditModal(true);
              }}
              className="rounded-full bg-blue-100 p-2">
              <MaterialIcons name="edit" size={20} color="#4A90E2" />
            </Pressable>
            <Pressable
              onPress={() => {
                setSelectedClient(client);
                setShowDeleteModal(true);
              }}
              className="rounded-full bg-red-100 p-2">
              <MaterialIcons name="delete" size={20} color="#FF6B6B" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );

  const renderFormModal = (isEdit: boolean) => (
    <Modal
      visible={isEdit ? showEditModal : showAddModal}
      transparent
      animationType="slide"
      onRequestClose={() => isEdit ? setShowEditModal(false) : setShowAddModal(false)}>
      <TouchableOpacity
        className="flex-1 justify-end bg-black/50"
        activeOpacity={1}
        onPress={() => isEdit ? setShowEditModal(false) : setShowAddModal(false)}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <ScrollView className="max-h-[90vh] rounded-t-3xl bg-white p-6">
            <Text className="mb-4 text-xl font-bold">{isEdit ? 'Edit Client' : 'Add Client'}</Text>
            
            {renderFormField('Client Name', 'clientName', 'Enter client name')}
            {renderFormField('Company Name', 'companyName', 'Enter company name')}
            {renderFormField('Phone Number', 'phoneNumber', 'Enter phone number', 'numeric')}
            {renderFormField('GST Number', 'gstNumber', 'Enter GST number')}
            {renderFormField('Site', 'site', 'Enter site')}
            {renderFormField('Branch', 'branch', 'Enter branch')}
            {renderFormField('Address', 'address', 'Enter address')}
            {renderFormField('Location', 'location', 'Enter location')}
            {renderFormField('Latitude', 'latitude', 'Enter latitude', 'numeric')}
            {renderFormField('Longitude', 'longitude', 'Enter longitude', 'numeric')}
            
            <View className="mb-4">
              <Text className="mb-1 text-sm font-medium text-gray-700">Status</Text>
              <View className="flex-row gap-4">
                <Pressable
                  onPress={() => handleInputChange('status', 'Active')}
                  className={`flex-1 rounded-lg border p-2 ${formData.status === 'Active' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                  <Text className={`text-center ${formData.status === 'Active' ? 'text-blue-500' : 'text-gray-500'}`}>Active</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleInputChange('status', 'Inactive')}
                  className={`flex-1 rounded-lg border p-2 ${formData.status === 'Inactive' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                  <Text className={`text-center ${formData.status === 'Inactive' ? 'text-blue-500' : 'text-gray-500'}`}>Inactive</Text>
                </Pressable>
              </View>
            </View>

            {renderFormField('Check-in Time', 'checkIn', 'HH:MM:SS')}
            {renderFormField('Lunch Time', 'lunch_time', 'HH:MM:SS')}
            {renderFormField('Check-out Time', 'check_out', 'HH:MM:SS')}

            <View className="flex-row justify-between mt-3 mb-10">
              <Pressable
                onPress={() => isEdit ? setShowEditModal(false) : setShowAddModal(false)}
                className="rounded-lg bg-gray-200 px-10 py-2">
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => handleSubmit(isEdit)}
                className="rounded-lg bg-blue-500 px-10 py-2">
                <Text className="text-white">{isEdit ? 'Save' : 'Add'}</Text>
              </Pressable>
            </View>
          </ScrollView>
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
            <Text className="mb-4 text-xl font-bold">Delete Client</Text>
            <Text className="mb-4 text-gray-600">
              Are you sure you want to delete {selectedClient?.clientName}?
            </Text>
            <View className="flex-row justify-end gap-2">
              <Pressable
                onPress={() => setShowDeleteModal(false)}
                className="rounded-lg bg-gray-200 px-4 py-2">
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleDelete}
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
      {/* <Stack.Screen
        options={{
          headerShown: true,
          title: 'Clients',
          // headerStyle: {
          //   backgroundColor: configFile.colorGreen,
          // },
          headerTintColor: 'white',
          headerRight: () => (
            <Pressable onPress={() => setShowAddModal(true)}>
              <MaterialIcons name="add" size={24} color="white" />
            </Pressable>
          ),
        }}
      /> */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Clients',
          headerStyle: {
            backgroundColor: configFile.colorGreen,
          },
          headerTintColor: 'white',
          headerRight: () => (
            <Pressable onPress={() => setShowAddModal(true)} style={{ marginRight: 16 }}>
              <MaterialIcons name="add" size={24} color="white" />
            </Pressable>
          ),
        }}
      />
 <SearchBar value={search} onChangeText={setSearch} placeholder="Search employee..." />


      {/* <SearchBar value={search} onChangeText={setSearch} placeholder="Search client..." /> */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={configFile.colorGreen} />
        </View>
      ) : (
        <ScrollView className="flex-1 p-4">
          {filteredClients.map((client) => renderClientCard(client))}
        </ScrollView>
      )}
      {renderFormModal(false)}
      {renderFormModal(true)}
      {renderDeleteModal()}
    </View>
  );
};

export default ClientsScreen;
