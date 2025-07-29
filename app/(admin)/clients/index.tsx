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
  FlatList,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { configFile } from '../../../config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import SearchBar from 'components/search';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
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
import { Api } from 'class/HandleApi';
import { NavRouter } from 'class/Router';
import { State } from 'class/State';
import { useIsFocused } from '@react-navigation/native';
import { company } from 'Memory/Token';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from 'class/Colors';
import Checkbox from 'components/Checkbox';

const ClientsScreen = () => {
  const params = useLocalSearchParams();
  const role = params.role as string | undefined;
  const empId = params.empId as string | undefined;
  const company = params.company as string | undefined;
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignWorkModal, setShowAssignWorkModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [Company, setCompany] = useState<company>(company || 'sdce');

  const switchCompany = () => setCompany((prev) => (prev === 'sdce' ? 'sq' : 'sdce'));

  const [formData, setFormData] = useState<Partial<Client>>({
    clientName: '',
    companyName: '',
    clientNo: '',
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
    selfClient: false,
  });
  const [assignWorkFormData, setAssignWorkFormData] = useState<AssignWorkFormData>({
    employeeId: '',
    companyNumber: '',
    fromDate: '',
    toDate: '',
  });

  const isFocus = useIsFocused();

  const [self, setSelf] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [assignWorkErrors, setAssignWorkErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAssigningWork, setIsAssigningWork] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const readOnly = isReadOnlyRole(role);
  console.log('ClientsScreen readOnly:', readOnly, 'role:', role);
  const [token, setToken] = useState<string>('');
  useEffect(() => {
    fetchClients(1);
    const token = State.getToken();

    setToken(token);
  }, [isFocus, Company]);

  useEffect(() => {
    setCompany(company);
    NavRouter.BackHandler({ role, empId, company: Company });
  }, [isFocus]);

  const fetchClients = async (pageNo: number, selfMode = self) => {
    if (pageNo > totalPages) return;

    try {
      pageNo === 1 ? setLoading(true) : setFetchingMore(true);

      let url = selfMode
        ? configFile.api.superAdmin.getAllSelf(pageNo) // You must define this API path
        : configFile.api.superAdmin.getAllClients(pageNo);

      if (Company == 'sq' && !selfMode) url += '&prefix=SQ';

      console.log(url, '///url');
      const response: any = await Api.handleApi({ url, type: 'GET' });
      if (response.status === 200) {
        const clientsDataRaw = Array.isArray(response.data.clients) ? response.data.clients : [];
        const clientsData = clientsDataRaw.map((c: any) => ({
          id: c.id,
          clientName: c.client_name,
          companyName: c.company_name,
          clientNo: c.client_no,
          phoneNumber: c.phone_number,
          gstNumber: c.gst_number,
          site: c.site,
          branch: c.branch,
          address: c.address,
          location: c.location || '',
          latitude: c.latitude,
          longitude: c.longitude,
          status: c.status,
          checkIn: c.check_in,
          lunch_time: c.lunch_time,
          check_out: c.check_out,
          selfClient: c.self_client ?? false,
        }));

        const totalPagesData =
          response.data.pagination?.totalPages &&
          typeof response.data.pagination.totalPages === 'number'
            ? response.data.pagination.totalPages
            : 1;

        if (pageNo === 1) {
          setAllClients(clientsData);
        } else {
          setAllClients((prev) => [...prev, ...clientsData]);
        }

        setTotalPages(totalPagesData);
        setPage(pageNo + 1);
      } else {
        Alert.alert('Error Fetching Clients');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    if (!search) {
      setClients(allClients);
    } else {
      setClients(
        allClients.filter(
          (client) =>
            client.clientName.toLowerCase().includes(search.toLowerCase()) ||
            client.companyName.toLowerCase().includes(search.toLowerCase()) ||
            client.location.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, allClients]);

  const reloadClients = async (page = 1, selfMode = self) => {
    setPage(1);
    setTotalPages(1);
    setAllClients([]);
    setClients([]);
    await fetchClients(page, selfMode);
  };

  const handleInputChange = (field: keyof Client, value: string | true) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    // console.log(client, '//////////Client');
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
      companyNumber: client.clientNo || '',
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

              setTimeout(() => {
                router.push({
                  pathname: '/(admin)/attendance',
                  params: {
                    empId,
                    role,
                  },
                });
                return;
              }, 2000);
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
    const validationErrors = validateClientForm(formData, isEdit);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setIsSubmitting(true);
      if (isEdit && selectedClient?.clientNo) {
        console.log('formData::', formData);
        // await clientService.updateClient(selectedClient.clientNo, formData);
        const payload: any = {
          clientName: formData.clientName,
          companyName: formData.companyName,
          clientNo: formData.clientNo,
          phoneNumber: formData.phoneNumber,
          gstNumber: formData.gstNumber,
          site: formData.site,
          branch: formData.branch,
          address: formData.address,
          location: formData.location,
          latitude: formData.latitude,
          longitude: formData.longitude,
          status: formData.status,
          checkIn: formData.checkIn,
          checkOut: formData.check_out,
          lunchTime: formData.lunch_time,
        };
        const url = configFile.api.superAdmin.updateClients(payload.clientNo);
        console.log(url, 'urlllll');

        const api = await Api.handleApi({ url, type: 'PUT', payload });

        switch (api.status) {
          case 200:
            Alert.alert('Success', 'Client updated successfully!');
            await reloadClients();
            setShowAddModal(false);
            setShowEditModal(false);
            return;

          case 400:
            Alert.alert(
              'Failed',
              'Missing Required Fields [ClientName , CompanyName , Site , Branch , PhoneNumber , ClientNo , Address]!'
            );
            return;
          case 404:
            Alert.alert('Failed', 'Client Not Found !');
            return;

          case 500:
            Alert.alert('Failed', 'Internal Server Error !');
            return;
        }
      } else {
        const data = await clientService.addClient(formData as Omit<Client, 'id'>);

        // const payLoad
        Alert.alert('Success', 'Client added successfully!');
        await reloadClients();
        setShowAddModal(false);
        setShowEditModal(false);
        return;
      }
    } catch (error: any) {
      let errorMessage = 'Failed to save client. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClient?.clientNo) return;
    try {
      setIsDeleting(true);
      // await clientService.deleteClient(selectedClient.clientNo);
      const url = configFile.api.superAdmin.clients.delete(selectedClient.clientNo);
      // console.log(url, '///DeleteURl');
      const api = await Api.handleApi({ url, type: 'DELETE', token }); // TOKEN
      Alert.alert(api.status == 200 ? 'Success' : 'Failed', api.data.message);
      await fetchClients(1);
      setShowDeleteModal(false);
    } catch (error: any) {
      let errorMessage = 'Failed to delete client. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      Alert.alert('Error', errorMessage);
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
        placeholderTextColor={'#b9b9b9'}
        className={` rounded-lg border p-2 text-black ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
        value={
          formData[field] !== undefined && formData[field] !== null ? String(formData[field]) : ''
        }
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
        placeholderTextColor={'#b9b9b9'}
        className={`rounded-lg border p-2 ${assignWorkErrors[field] ? 'border-red-500' : 'border-gray-300'}`}
        value={assignWorkFormData[field]}
        onChangeText={(value) => handleAssignWorkInputChange(field, value.toUpperCase())}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
      {assignWorkErrors[field] && (
        <Text className="mt-1 text-sm text-red-500">{assignWorkErrors[field]}</Text>
      )}
    </View>
  );

  const renderClientCard = (client: Client) => (
    <View
      key={client.id}
      className="mb-4 overflow-hidden rounded-xl shadow-lg"
      style={{ backgroundColor: Colors.get(Company, 'card') }}>
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="w-[200px] truncate text-xl font-bold text-gray-800">
              {client.clientName}
            </Text>
            <Text className="w-[200px] truncate text-gray-600">Company: {client.companyName}</Text>
            <Text className="w-[200px] truncate text-gray-600">Location: {client?.address}</Text>
            <Text className="w-[200px] truncate text-gray-600">Status: {client.status}</Text>
            <Text className="w-[200px] truncate text-gray-600">ID: : {client.clientNo}</Text>
          </View>
          {!readOnly && (
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => openEditClientModal(client)}
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
            <Text className="mb-4 text-xl font-bold text-black">
              {isEdit ? 'Edit Client' : 'Add Client'}
            </Text>

            {renderFormField('Client Name *', 'clientName', 'Enter client name')}
            {renderFormField('Company Name *', 'companyName', 'Enter company name')}
            {renderFormField('Client Number *', 'clientNo', 'Enter client number')}
            {renderFormField('Phone Number *', 'phoneNumber', 'Enter phone number', 'numeric')}
            {renderFormField('GST Number ', 'gstNumber', 'Enter GST number')}
            {renderFormField('Site *', 'site', 'Enter site')}
            {renderFormField('Branch *', 'branch', 'Enter branch')}
            {renderFormField('Address *', 'address', 'Enter address')}
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

            {/* {showAddModal &&
              formData.latitude &&
              formData.longitude &&
              formData.checkIn &&
              formData.check_out &&
              formData.check_out && (
                <Checkbox
                  label="Self Client:"
                  value={formData.selfClient}
                  setValue={(value) => handleInputChange('selfClient', value)}
                />
              )} */}

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
            <Text className="mb-4 text-xl font-bold text-black">Delete Client</Text>
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

  const renderItem = ({ item }: { item: Client }) => renderClientCard(item);

  // Handler to open add client modal
  const openAddClientModal = () => {
    setFormData({
      clientName: '',
      companyName: '',
      clientNo: '',
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
    setErrors({});
    setShowAddModal(true);
  };

  // Handler to open edit client modal
  const openEditClientModal = (client: Client) => {
    setSelectedClient(client);
    setFormData({ ...client });
    setErrors({});
    setShowEditModal(true);
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: !self ? 'Clients' : 'Attendance Clients',
          headerStyle: {
            backgroundColor: configFile.colorGreen,
          },
          headerTintColor: 'white',
          headerRight: () => (
            <View
              style={{
                marginRight: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 13,
              }}>
              {/* <TouchableOpacity onPress={switchCompany}>
                {Company === 'sdce' ? (
                  <MaterialIcons name="security" size={24} color="white" />
                ) : (
                  <MaterialCommunityIcons name="broom" size={24} color="white" />
                )}
              </TouchableOpacity> */}
              {/* <TouchableOpacity
                onPress={() => {
                  setSelf((prev) => {
                    const next = !prev;
                    reloadClients(1, next); // fetch clients with appropriate flag
                    return next;
                  });
                }}>
                {!self ? (
                  <FontAwesome6 name="building-flag" size={24} color="white" />
                ) : (
                  <FontAwesome6 name="building-shield" size={24} color="white" />
                )}
              </TouchableOpacity> */}
            </View>
          ),
        }}
      />

      <View style={{ flex: 1, backgroundColor: Colors.get(Company, 'bg'), position: 'relative' }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search client..." />

        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.get(Company, 'bg'),
            }}>
            <ActivityIndicator size="large" color={configFile.colorGreen} />
          </View>
        ) : (
          <FlatList
            data={clients}
            keyExtractor={(item, i) => i.toString()}
            renderItem={renderItem}
            onEndReached={() => fetchClients(page, self)}
            onEndReachedThreshold={0.5}
            style={{ backgroundColor: Colors.get(Company, 'bg') }}
            ListFooterComponent={
              fetchingMore ? <ActivityIndicator size="small" color="#000" /> : null
            }
            contentContainerStyle={{ padding: 16 }}
          />
        )}

        {!readOnly && renderFormModal(false)}
        {!readOnly && renderFormModal(true)}
        {!readOnly && renderDeleteModal()}
        {!readOnly && renderAssignWorkModal()}

        <Pressable
          onPress={openAddClientModal}
          style={{
            position: 'absolute',
            right: 24,
            bottom: 32,
            backgroundColor: '#4A90E2',
            borderRadius: 32,
            width: 56,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}>
          <MaterialIcons name="add" size={32} color="white" />
        </Pressable>
      </View>
    </>
  );
};

export default ClientsScreen;
