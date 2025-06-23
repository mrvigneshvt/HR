import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { configFile } from '../../../config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import SearchBar from 'components/search';
import { clientService, Client } from '../../../services/clientService';
import {
  validateClientForm,
  ValidationErrors,
  validateAssignWorkForm,
  validateClientForAssignWork,
  AssignWorkFormData,
} from '../../../utils/validation';
import { BackHandler } from 'react-native';
import { router } from 'expo-router';
import { assignWork } from '../../../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';

import { isReadOnlyRole } from 'utils/roleUtils';

const ClientsScreen = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignWorkModal, setShowAssignWorkModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<any>>({
    clientName: '',
    companyName: '',
    companyNumber: '',
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
    check_out: '',
  });
  const [assignWorkFormData, setAssignWorkFormData] = useState<AssignWorkFormData>({
    employeeId: '',
    companyNumber: '',
    fromDate: '',
    toDate: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [assignWorkErrors, setAssignWorkErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAssigningWork, setIsAssigningWork] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const params = useLocalSearchParams();
  const role = params.role as string | undefined;
  const empId = params.empId as string | undefined;
  const readOnly = isReadOnlyRole(role);
  console.log('ClientsScreen readOnly:', readOnly, 'role:', role);

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
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAssignWorkInputChange = (field: keyof AssignWorkFormData, value: string) => {
    setAssignWorkFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (assignWorkErrors[field]) {
      setAssignWorkErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAssignWorkClick = (client: Client) => {
    // Validate client has required fields for work assignment
    const clientValidationErrors = validateClientForAssignWork(client);
    if (Object.keys(clientValidationErrors).length > 0) {
      const errorMessages = Object.values(clientValidationErrors).join('\n• ');
      Alert.alert(
        'Cannot Assign Work',
        `This client is missing required information:\n\n• ${errorMessages}\n\nPlease update the client information first.`,
        [
          {
            text: 'Edit Client',
            onPress: () => {
              setSelectedClient(client);
              setFormData(client);
              setShowEditModal(true);
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    // Check if client is active
    if (client.status !== 'Active') {
      Alert.alert(
        'Cannot Assign Work',
        'Only active clients can be assigned work. Please activate this client first.',
        [
          {
            text: 'Edit Client',
            onPress: () => {
              setSelectedClient(client);
              setFormData(client);
              setShowEditModal(true);
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    setSelectedClient(client);
    setAssignWorkFormData({
      employeeId: '',
      companyNumber: client.companyNumber || '',
      fromDate: new Date().toISOString().split('T')[0], // Today's date
      toDate: new Date().toISOString().split('T')[0], // Today's date
    });
    setAssignWorkErrors({}); // Clear any previous errors
    setShowAssignWorkModal(true);
  };

  const handleAssignWorkSubmit = async () => {
    const validationErrors = validateAssignWorkForm(assignWorkFormData);
    if (Object.keys(validationErrors).length > 0) {
      setAssignWorkErrors(validationErrors);
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      'Confirm Assignment',
      `Are you sure you want to assign work to employee ${assignWorkFormData.employeeId} for ${selectedClient?.clientName} from ${assignWorkFormData.fromDate} to ${assignWorkFormData.toDate}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Assign Work',
          onPress: async () => {
            try {
              setIsAssigningWork(true);
              setAssignWorkErrors({}); // Clear any previous errors

              const response = await assignWork(assignWorkFormData);

              Alert.alert('Success', 'Work assigned successfully!', [
                {
                  text: 'OK',
                  onPress: handleAssignWorkModalClose,
                },
              ]);
            } catch (error: any) {
              console.error('Error assigning work:', error);
              let errorMessage = 'Failed to assign work. Please try again.';

              if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
              } else if (error.message) {
                errorMessage = error.message;
              }

              Alert.alert('Error', errorMessage);
            } finally {
              setIsAssigningWork(false);
            }
          },
        },
      ]
    );
  };

  const handleAssignWorkModalClose = () => {
    setShowAssignWorkModal(false);
    setAssignWorkFormData({
      employeeId: '',
      companyNumber: '',
      fromDate: '',
      toDate: '',
    });
    setAssignWorkErrors({});
    setSelectedClient(null);
  };

  const handleSubmit = async (isEdit: boolean) => {
    const validationErrors = validateClientForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEdit && selectedClient?.id) {
        await clientService.updateClient(selectedClient.id, formData as Omit<Client, 'id'>);
        Alert.alert('Success', 'Client updated successfully!');
      } else {
        console.log(formData, 'formData');
        const data = await clientService.addClient(formData as Omit<Client, 'id'>);
        console.log(data, 'dataONAdd');
        Alert.alert('Success', 'Client added successfully!');
      }
      await fetchClients();
      setShowAddModal(false);
      setShowEditModal(false);
      setFormData({
        clientName: '',
        companyName: '',
        companyNumber: '',
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
        check_out: '',
      });
    } catch (error) {
      console.error('Error saving client:', error);
      Alert.alert('Error', 'Failed to save client. Please try again.');
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClient?.id) return;
    try {
      setIsDeleting(true);
      await clientService.deleteClient(selectedClient.id);
      Alert.alert('Success', 'Client deleted successfully!');
      await fetchClients();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting client:', error);
      Alert.alert('Error', 'Failed to delete client. Please try again.');
    } finally {
      setIsDeleting(false);
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.clientName.toLowerCase().includes(search.toLowerCase()) ||
      client.companyName.toLowerCase().includes(search.toLowerCase()) ||
      client.location.toLowerCase().includes(search.toLowerCase())
  );

  const renderFormField = (
    label: string,
    field: keyof Client,
    placeholder: string,
    keyboardType: 'default' | 'numeric' = 'default'
  ) => (
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

  const renderAssignWorkFormField = (
    label: string,
    field: keyof AssignWorkFormData,
    placeholder: string,
    keyboardType: 'default' | 'numeric' = 'default'
  ) => (
    <View className="mb-4">
      <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
      <TextInput
        className={`rounded-lg border p-2 ${assignWorkErrors[field] ? 'border-red-500' : 'border-gray-300'}`}
        value={assignWorkFormData[field]}
        onChangeText={(value) => handleAssignWorkInputChange(field, value)}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
      {assignWorkErrors[field] && (
        <Text className="mt-1 text-sm text-red-500">{assignWorkErrors[field]}</Text>
      )}
    </View>
  );

  const renderClientCard = (client: Client) => (
    <View key={client.id} className="mb-4 overflow-hidden rounded-xl bg-white shadow-lg">
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="w-[200px] truncate text-xl font-bold text-gray-800">
              {client.clientName}
            </Text>
            <Text className="w-[200px] truncate text-gray-600">Company: {client.companyName}</Text>
            <Text className="w-[200px] truncate text-gray-600">Location: {client.location}</Text>
            <Text className="w-[200px] truncate text-gray-600">Status: {client.status}</Text>
          </View>
          {!readOnly && (
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => handleAssignWorkClick(client)}
                className="rounded-full bg-green-100 p-2">
                <MaterialIcons name="work" size={20} color="#4CAF50" />
              </Pressable>
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
          )}
        </View>
      </View>
    </View>
  );

  const renderFormModal = (isEdit: boolean) => (
    <Modal
      visible={isEdit ? showEditModal : showAddModal}
      transparent
      animationType="slide"
      onRequestClose={() => (isEdit ? setShowEditModal(false) : setShowAddModal(false))}>
      <TouchableOpacity
        className="flex-1 justify-end bg-black/50"
        activeOpacity={1}
        onPress={() => (isEdit ? setShowEditModal(false) : setShowAddModal(false))}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <ScrollView className="max-h-[90vh] rounded-t-3xl bg-white p-6">
            <Text className="mb-4 text-xl font-bold">{isEdit ? 'Edit Client' : 'Add Client'}</Text>

            {renderFormField('Client Name', 'clientName', 'Enter client name')}
            {renderFormField('Company Name', 'companyName', 'Enter company name')}
            {renderFormField('Company Number', 'companyNumber', 'Enter company number')}
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
                  <Text
                    className={`text-center ${formData.status === 'Active' ? 'text-blue-500' : 'text-gray-500'}`}>
                    Active
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handleInputChange('status', 'Inactive')}
                  className={`flex-1 rounded-lg border p-2 ${formData.status === 'Inactive' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                  <Text
                    className={`text-center ${formData.status === 'Inactive' ? 'text-blue-500' : 'text-gray-500'}`}>
                    Inactive
                  </Text>
                </Pressable>
              </View>
            </View>

            {renderFormField('Check-in Time', 'checkIn', 'HH:MM:SS')}
            {renderFormField('Lunch Time', 'lunch_time', 'HH:MM:SS')}
            {renderFormField('Check-out Time', 'check_out', 'HH:MM:SS')}

            <View className="mb-10 mt-3 flex-row justify-between">
              <Pressable
                onPress={() => (isEdit ? setShowEditModal(false) : setShowAddModal(false))}
                className="rounded-lg bg-gray-200 px-10 py-2"
                disabled={isSubmitting}>
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => handleSubmit(isEdit)}
                className="rounded-lg bg-blue-500 px-10 py-2"
                disabled={isSubmitting}>
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white">{isEdit ? 'Save' : 'Add'}</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  const renderAssignWorkModal = () => (
    <Modal
      visible={showAssignWorkModal}
      transparent
      animationType="slide"
      onRequestClose={handleAssignWorkModalClose}>
      <TouchableOpacity
        className="flex-1 justify-end bg-black/50"
        activeOpacity={1}
        onPress={handleAssignWorkModalClose}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <ScrollView className="max-h-[90vh] rounded-t-3xl bg-white p-6">
            <Text className="mb-4 text-xl font-bold">Assign Work</Text>
            <Text className="mb-4 text-sm text-gray-600">
              Assign work to employee for client: {selectedClient?.clientName}
            </Text>

            {renderAssignWorkFormField('Employee ID', 'employeeId', 'Enter employee ID')}
            {renderAssignWorkFormField('Company Number', 'companyNumber', 'Enter company number')}

            {/* From Date */}
            <View className="mb-4">
              <Text className="mb-1 text-sm font-medium text-gray-700">From Date</Text>
              <Pressable
                className={`rounded-lg border p-2 ${assignWorkErrors.fromDate ? 'border-red-500' : 'border-gray-300'}`}
                onPress={() => setShowFromDatePicker(true)}>
                <Text className={assignWorkFormData.fromDate ? 'text-gray-900' : 'text-gray-500'}>
                  {assignWorkFormData.fromDate || 'Select from date'}
                </Text>
              </Pressable>
              {assignWorkErrors.fromDate && (
                <Text className="mt-1 text-sm text-red-500">{assignWorkErrors.fromDate}</Text>
              )}
            </View>

            {/* To Date */}
            <View className="mb-4">
              <Text className="mb-1 text-sm font-medium text-gray-700">To Date</Text>
              <Pressable
                className={`rounded-lg border p-2 ${assignWorkErrors.toDate ? 'border-red-500' : 'border-gray-300'}`}
                onPress={() => setShowToDatePicker(true)}>
                <Text className={assignWorkFormData.toDate ? 'text-gray-900' : 'text-gray-500'}>
                  {assignWorkFormData.toDate || 'Select to date'}
                </Text>
              </Pressable>
              {assignWorkErrors.toDate && (
                <Text className="mt-1 text-sm text-red-500">{assignWorkErrors.toDate}</Text>
              )}
            </View>

            {/* Date Pickers */}
            {showFromDatePicker && (
              <DateTimePicker
                value={
                  assignWorkFormData.fromDate ? new Date(assignWorkFormData.fromDate) : new Date()
                }
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={new Date()}
                onChange={(event, date) => {
                  setShowFromDatePicker(false);
                  if (date) {
                    handleAssignWorkInputChange('fromDate', date.toISOString().split('T')[0]);
                  }
                }}
              />
            )}

            {showToDatePicker && (
              <DateTimePicker
                value={assignWorkFormData.toDate ? new Date(assignWorkFormData.toDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={
                  assignWorkFormData.fromDate ? new Date(assignWorkFormData.fromDate) : new Date()
                }
                onChange={(event, date) => {
                  setShowToDatePicker(false);
                  if (date) {
                    handleAssignWorkInputChange('toDate', date.toISOString().split('T')[0]);
                  }
                }}
              />
            )}

            <View className="mb-10 mt-3 flex-row justify-between">
              <Pressable
                onPress={handleAssignWorkModalClose}
                className="rounded-lg bg-gray-200 px-10 py-2"
                disabled={isAssigningWork}>
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleAssignWorkSubmit}
                className="rounded-lg bg-green-500 px-10 py-2"
                disabled={isAssigningWork}>
                {isAssigningWork ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white">Assign Work</Text>
                )}
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
                className="rounded-lg bg-gray-200 px-4 py-2"
                disabled={isDeleting}>
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleDelete}
                className="rounded-lg bg-red-500 px-4 py-2"
                disabled={isDeleting}>
                {isDeleting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white">Delete</Text>
                )}
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  useEffect(() => {
    const onBackPress = () => {
      router.replace({
        pathname: '/home',
        params: { role, empId },
      });
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, []);

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
          headerRight: () =>
            !readOnly && (
              <Pressable
                onPress={() => {
                  setShowAddModal(true);
                  setFormData({
                    clientName: '',
                    companyName: '',
                    companyNumber: '',
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
                    check_out: '',
                  });
                }}
                style={{ marginRight: 16 }}>
                <MaterialIcons name="add" size={24} color="white" />
              </Pressable>
            ),
        }}
      />
      <SearchBar value={search} onChangeText={setSearch} placeholder="Search client..." />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={configFile.colorGreen} />
        </View>
      ) : (
        <ScrollView className="flex-1 p-4">
          {filteredClients.map((client) => renderClientCard(client))}
        </ScrollView>
      )}
      {!readOnly && renderFormModal(false)}
      {!readOnly && renderFormModal(true)}
      {!readOnly && renderDeleteModal()}
      {!readOnly && renderAssignWorkModal()}
    </View>
  );
};

export default ClientsScreen;
