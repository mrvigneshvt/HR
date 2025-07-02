import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState, useEffect } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { configFile } from '../../../config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SearchBar from 'components/search';
import {
  requestsService,
  UniformRequest,
  LeaveRequest,
  LeaveRequestAddPayload,
} from '../../../services/requests';
import UniformRequestForm from '../../../components/UniformRequestForm';
import LeaveRequestForm from '../../../components/LeaveRequestForm';
import { isReadOnlyRole } from 'utils/roleUtils';
import { BackHandler } from 'react-native';
import { router } from 'expo-router';
import { State } from 'class/State';
import { Api } from 'class/HandleApi';
import { useIsFocused } from '@react-navigation/native';

const randomId = () => crypto.randomUUID();
const RequestsScreen = () => {
  const isFocus = useIsFocused();
  const [token, setToken] = useState<string>('');
  const [activeTab, setActiveTab] = useState('uniform');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [uniformRequests, setUniformRequests] = useState<UniformRequest[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  // Form states
  const [uniformForm, setUniformForm] = useState<UniformRequest>({
    empId: '',
    name: '',
    designation: '',
    site: '',
    location: '',
    gender: 'Male',
    status: 'Active',
    shirtSize: '',
    pantSize: '',
    shoeSize: '',
    chuditharSize: '',
    femaleShoeSize: '',
    accessories: [],
    femaleAccessories: [],
    requestedDate: '',
    flab: '',
  });

  const initialLeaveForm: LeaveRequest = {
    employeeId: '',
    employeeName: '',
    leaveType: 'Casual',
    startDate: undefined as any,
    endDate: undefined as any,
    status: 'Pending',
    approvedBy: '',
    numberOfDays: 0,
  };
  const [leaveForm, setLeaveForm] = useState<LeaveRequest>(initialLeaveForm);

  const params = useLocalSearchParams();
  const role = params.role as string | undefined;
  const empId = params.empId as string | undefined;
  const readOnly = isReadOnlyRole(role);
  console.log('RequestsScreen readOnly:', readOnly, 'role:', role);

  useEffect(() => {
    fetchRequests();
    const Token = State.getToken();
    setToken(Token);
  }, [isFocus]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [uniformData, leaveData] = await Promise.all([
        requestsService.getUniformRequests(),
        requestsService.getLeaveRequests(),
      ]);
      setUniformRequests(uniformData);
      setLeaveRequests(leaveData);
      console.log(uniformData, '//////uniFORM\n\n');

      console.log(leaveData, '//////LeaveRequest');
    } catch (error) {
      console.error('Error fetching requests:', error);
      Alert.alert('Error', 'Failed to fetch requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateString = (date: any) => {
    if (!date) return '';
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      // Format as D/M/YY (e.g., 1/1/25)
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear() % 100; // last two digits
      return `${day}/${month}/${year < 10 ? '0' : ''}${year}`;
    }
    return '';
  };

  const handleAddRequest = async () => {
    try {
      setLoading(true);
      if (activeTab === 'uniform') {
        const payload = {
          empId: uniformForm.empId,
          name: uniformForm.name,
          designation: uniformForm.designation,
          site: uniformForm.site,
          location: uniformForm.location,
          gender: uniformForm.gender,
          status: uniformForm.status,
          shirtSize: uniformForm.shirtSize,
          pantSize: uniformForm.pantSize,
          shoeSize: uniformForm.shoeSize,
          chuditharSize: uniformForm.chuditharSize,
          femaleShoeSize: uniformForm.femaleShoeSize,
          accessories: uniformForm.accessories,
          femaleAccessories: uniformForm.femaleAccessories,
          requestedDate: uniformForm.requestedDate
            ? uniformForm.requestedDate
            : formatDateString(new Date()),
          flab: uniformForm.flab,
        };

        await requestsService.addUniformRequest(payload);
        setUniformForm({
          empId: '',
          name: '',
          designation: '',
          site: '',
          location: '',
          gender: 'Male',
          status: 'Active',
          shirtSize: '',
          pantSize: '',
          shoeSize: '',
          chuditharSize: '',
          femaleShoeSize: '',
          accessories: [],
          femaleAccessories: [],
          requestedDate: '',
          flab: '',
        });
      } else {
        const payload: LeaveRequestAddPayload = {
          ...leaveForm,
          startDate: leaveForm.startDate ? formatDateString(leaveForm.startDate) : '',
          endDate: leaveForm.endDate ? formatDateString(leaveForm.endDate) : '',
        };
        await requestsService.addLeaveRequest(payload);
        setLeaveForm(initialLeaveForm);
      }
      Alert.alert(
        'Success',
        `${activeTab === 'uniform' ? 'Uniform' : 'Leave'} request added successfully`
      );
      setShowAddModal(false);
      fetchRequests();
    } catch (error) {
      console.error('Error adding request:', error);
      Alert.alert('Error', 'Failed to add request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async () => {
    try {
      setLoading(true);
      if (activeTab === 'uniform') {
        // Only pick the fields needed for the API
        const {
          empId,
          name,
          designation,
          site,
          location,
          gender,
          status,
          shirtSize,
          pantSize,
          shoeSize,
          chuditharSize,
          femaleShoeSize,
          accessories,
          femaleAccessories,
          flab,
        } = uniformForm;
        const payload = {
          empId,
          name,
          designation,
          site,
          location,
          gender,
          status,
          shirtSize,
          pantSize,
          shoeSize,
          chuditharSize,
          femaleShoeSize,
          accessories,
          femaleAccessories,
          requestedDate: formatDateString(uniformForm.requestedDate),
          flab,
        };
        await requestsService.updateUniformRequest(selectedRequest._id, payload);
      } else {
        await requestsService.updateLeaveRequest(selectedRequest._id, leaveForm);
        setLeaveForm(initialLeaveForm);
      }
      Alert.alert(
        'Success',
        `${activeTab === 'uniform' ? 'Uniform' : 'Leave'} request updated successfully`
      );
      setShowEditModal(false);
      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      Alert.alert('Error', 'Failed to update request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      setLoading(true);
      if (activeTab === 'uniform') {
        await requestsService.deleteUniformRequest(selectedRequest._id);
      } else {
        const id = selectedRequest._id || selectedRequest.id;
        if (!id) {
          Alert.alert('Error', 'Invalid request ID');
          return;
        }
        await requestsService.deleteLeaveRequest(id);
      }
      Alert.alert(
        'Success',
        `${activeTab === 'uniform' ? 'Uniform' : 'Leave'} request deleted successfully`
      );
      setShowDeleteModal(false);
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      Alert.alert('Error', 'Failed to delete request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (activeTab === 'uniform') {
      if (
        !uniformForm.empId ||
        !uniformForm.name ||
        !uniformForm.designation ||
        !uniformForm.site ||
        !uniformForm.location
      ) {
        Alert.alert('Error', 'Please fill in all required fields');
        return false;
      }
      if (uniformForm.gender === 'Male' && (!uniformForm.shirtSize || !uniformForm.pantSize)) {
        Alert.alert('Error', 'Please provide shirt and pant sizes for male employees');
        return false;
      }
      if (uniformForm.gender === 'Female' && !uniformForm.chuditharSize) {
        Alert.alert('Error', 'Please provide chudithar size for female employees');
        return false;
      }
    } else {
      if (
        !leaveForm.employeeId ||
        !leaveForm.employeeName ||
        !leaveForm.leaveType ||
        !leaveForm.startDate ||
        !leaveForm.endDate ||
        !leaveForm.status ||
        !leaveForm.approvedBy ||
        !leaveForm.numberOfDays
      ) {
        Alert.alert('Error', 'Please fill in all required fields');
        return false;
      }
      if (new Date(leaveForm.endDate) < new Date(leaveForm.startDate)) {
        Alert.alert('Error', 'End date cannot be before start date');
        return false;
      }
    }
    return true;
  };

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
            <Text className="mb-4 text-xl font-bold">
              Add {activeTab === 'uniform' ? 'Uniform' : 'Leave'} Request
            </Text>
            {activeTab === 'uniform' ? (
              <UniformRequestForm
                form={uniformForm}
                onChange={(field, value) => setUniformForm((prev) => ({ ...prev, [field]: value }))}
                onSubmit={() => {
                  if (validateForm()) {
                    handleAddRequest();
                  }
                }}
                loading={loading}
              />
            ) : (
              <LeaveRequestForm
                form={leaveForm}
                onChange={(field, value) => setLeaveForm((prev) => ({ ...prev, [field]: value }))}
                onSubmit={() => {
                  if (validateForm()) {
                    handleAddRequest();
                  }
                }}
                loading={loading}
              />
            )}
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
            <Text className="mb-4 text-xl font-bold">
              Edit {activeTab === 'uniform' ? 'Uniform' : 'Leave'} Request
            </Text>
            {activeTab === 'uniform' ? (
              <UniformRequestForm
                form={uniformForm}
                onChange={(field, value) => setUniformForm((prev) => ({ ...prev, [field]: value }))}
                onSubmit={() => {
                  if (validateForm()) {
                    handleUpdateRequest();
                  }
                }}
                loading={loading}
              />
            ) : (
              <LeaveRequestForm
                form={leaveForm}
                onChange={(field, value) => setLeaveForm((prev) => ({ ...prev, [field]: value }))}
                onSubmit={() => {
                  if (validateForm()) {
                    handleUpdateRequest();
                  }
                }}
                loading={loading}
              />
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  const renderAcceptModal = () => (
    <Modal
      visible={showAcceptModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowAcceptModal(false)}>
      <TouchableOpacity
        className="flex-1 justify-end bg-black/50"
        activeOpacity={1}
        onPress={() => setShowAcceptModal(false)}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View className="rounded-t-3xl bg-white p-6">
            <Text className="mb-4 text-xl font-bold">Accept Request</Text>
            <Text className="mb-4 text-gray-600">
              Are you sure you want to Accept this request?
            </Text>
            <View className="flex-row justify-end gap-2">
              <Pressable
                onPress={() => {
                  setShowAcceptModal(false);
                  setSelectedRequest(null);
                }}
                className="rounded-lg bg-gray-200 px-4 py-2">
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  console.log('\n\nAccpet Triggered');
                  handleToggle('accept');
                }}
                className="rounded-lg bg-green-500 px-4 py-2"
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white">Accept</Text>
                )}
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  const renderRejectModal = () => (
    <Modal
      visible={showRejectModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowRejectModal(false)}>
      <TouchableOpacity
        className="flex-1 justify-end bg-black/50"
        activeOpacity={1}
        onPress={() => setShowRejectModal(false)}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View className="rounded-t-3xl bg-white p-6">
            <Text className="mb-4 text-xl font-bold">Reject Request</Text>
            <Text className="mb-4 text-gray-600">
              Are you sure you want to Reject this request?
            </Text>
            <View className="flex-row justify-end gap-2">
              <Pressable
                onPress={() => {
                  setShowRejectModal(false);
                  setSelectedRequest(null);
                }}
                className="rounded-lg bg-gray-200 px-4 py-2">
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  console.log('\n\nAccpet Triggered');
                  handleToggle('reject');
                }}
                className="rounded-lg bg-red-500 px-4 py-2"
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white">Reject</Text>
                )}
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  const handleToggle = async (data: 'accept' | 'reject') => {
    console.log('triggring toggle::', selectedRequest);
    let url;
    let action = data == 'accept' ? 'Approved' : 'Rejected';
    if (selectedRequest.gender) {
      url = configFile.api.superAdmin.request.uniform.update(selectedRequest.empId);
      const body = {
        ...selectedRequest,
        status: action,
      };
      console.log(url, '///\n\n', body, '///////////////////body');
      const api = await Api.handleApi({ url, type: 'PUT', payload: body, token });
      Alert.alert(api.status == 200 ? 'Success' : 'Failed', api.data.message);
      if (api.status == 200) {
        setSelectedRequest(null);
        action == 'Approved' ? setShowAcceptModal(false) : setShowRejectModal(false);
        fetchRequests();
        return;
      }
    } else {
      url = configFile.api.superAdmin.request.leaves.update(selectedRequest.employeeId);
      const body = {
        ...selectedRequest,
        status: action,
      };
      const api = await Api.handleApi({ url, type: 'PUT', payload: body, token });
      Alert.alert(api.status == 200 ? 'Success' : 'Failed', api.data.message);
      if (api.status == 200) {
        setSelectedRequest(null);
        action == 'Approved' ? setShowAcceptModal(false) : setShowRejectModal(false);
        fetchRequests();
        return;
      }
    }
  };

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
            <Text className="mb-4 text-xl font-bold">Delete Request</Text>
            <Text className="mb-4 text-gray-600">
              Are you sure you want to delete this request?
            </Text>
            <View className="flex-row justify-end gap-2">
              <Pressable
                onPress={() => setShowDeleteModal(false)}
                className="rounded-lg bg-gray-200 px-4 py-2">
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleDeleteRequest}
                className="rounded-lg bg-red-500 px-4 py-2"
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="white" />
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

  const renderRequestCard = (
    req: any,
    type: 'uniform' | 'leave',
    showActions = true,
    idx: number
  ) => (
    <View key={idx} className="mb-4 overflow-hidden rounded-xl bg-white shadow-lg">
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-gray-800">{req.name || req.employeeName}</Text>
            <Text className="text-gray-600">ID: {req.employeeId || req.empId}</Text>
            {type === 'uniform' ? (
              <>
                <Text className="text-gray-600">Gender: {req.gender}</Text>
                {req.gender === 'Male' ? (
                  <>
                    <Text className="text-gray-600">Shirt Size: {req.shirtSize}</Text>
                    <Text className="text-gray-600">Pant Size: {req.pantSize}</Text>
                  </>
                ) : (
                  <Text className="text-gray-600">Chudithar Size: {req.chuditharSize}</Text>
                )}
                <Text className="text-gray-600">Shoe Size: {req.shoeSize}</Text>
              </>
            ) : (
              <>
                <Text className="text-gray-600">Type: {req.leaveType}</Text>
                <Text className="text-gray-600">Duration: {req.numberOfDays} days</Text>
                <Text className="text-gray-600">
                  Start Date: {new Date(req.startDate).toLocaleDateString()}
                </Text>
                <Text className="text-gray-600">
                  End Date: {new Date(req.endDate).toLocaleDateString()}
                </Text>
              </>
            )}
          </View>
          {showActions && !readOnly && (
            <View className="flex-row gap-2">
              {/* <Pressable
                onPress={() => {
                  setSelectedRequest(req);
                  if (type === 'uniform') {
                    setUniformForm(req);
                  } else {
                    setLeaveForm(req);
                  }
                  setShowEditModal(true);
                }}
                className="rounded-full bg-blue-100 p-2">
                <MaterialIcons name="edit" size={20} color="#4A90E2" />
              </Pressable> */}
              <Pressable
                onPress={() => {
                  setSelectedRequest(req);
                  setShowDeleteModal(true);
                }}
                className="rounded-full bg-red-100 p-2">
                <MaterialIcons name="delete" size={20} color="#FF6B6B" />
              </Pressable>
            </View>
          )}
        </View>
        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="mr-2 font-semibold text-gray-700">Status:</Text>
            <View className="flex flex-row gap-2">
              <View
                className="flex-row gap-1 rounded-full px-3 py-1"
                style={{ backgroundColor: `${getStatusColor(req.status)}20` }}>
                <Text style={{ color: getStatusColor(req.status) }}>{`${req.status}`}</Text>
                {req.status.toLowerCase() !== 'pending' &&
                  (req.status.toLowerCase() === 'approved' ? (
                    <Feather name="user-check" size={20} color="green" />
                  ) : (
                    <Feather name="user-x" size={20} color="red" />
                  ))}
                <Text style={{ color: getStatusColor(req.status) }}>{req.approvedBy}</Text>
                {/*</TouchableOpacity> */}
              </View>
            </View>
          </View>
          {req.status === 'Pending' && !readOnly && (
            <TouchableOpacity className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => {
                  setSelectedRequest(req);
                  setShowAcceptModal(true);
                  console.log(req, '////Req');
                }}
                className="rounded-lg bg-green-500 px-4 py-2">
                {/* <Text className="text-white">Approve</Text> */}
                <FontAwesome name="check-circle" size={19} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedRequest(req);
                  setShowRejectModal(true);
                }}
                className="rounded-lg bg-red-500 px-4 py-2">
                {/* <Text className="text-white">Reject</Text> */}
                <Entypo name="circle-with-cross" size={19} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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

  const filteredUniformRequests = uniformRequests.filter(
    (req) =>
      req.name.toLowerCase().includes(search.toLowerCase()) ||
      req.empId.toLowerCase().includes(search.toLowerCase())
  );

  const filteredLeaveRequests = leaveRequests.filter(
    (req) =>
      req.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      req.employeeId.toLowerCase().includes(search.toLowerCase())
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
          title: 'Requests',
          headerStyle: {
            backgroundColor: configFile.colorGreen,
          },
          headerTintColor: 'white',
          // headerRight: () =>
          //   !readOnly && (
          //     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          //       <Pressable onPress={() => setShowFilterModal(true)} style={{ marginRight: 16 }}>
          //         <MaterialIcons name="filter-list" size={24} color="white" />
          //       </Pressable>
          //       <Pressable
          //         onPress={() => {
          //           setShowAddModal(true);
          //           setUniformForm({
          //             empId: '',
          //             name: '',
          //             designation: '',
          //             site: '',
          //             location: '',
          //             gender: 'Male',
          //             status: 'Active',
          //             shirtSize: '',
          //             pantSize: '',
          //             shoeSize: '',
          //             chuditharSize: '',
          //             femaleShoeSize: '',
          //             accessories: [],
          //             femaleAccessories: [],
          //             requestedDate: '',
          //             flab: '',
          //           });
          //           setLeaveForm(initialLeaveForm);
          //         }}>
          //         <MaterialIcons name="add" size={24} color="white" />
          //       </Pressable>
          //     </View>
          //   ),
        }}
      />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={configFile.colorGreen} />
        </View>
      ) : (
        <>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Search employee..." />
          <View className="mx-4 my-4 flex-row justify-around rounded-2xl bg-gray-200 p-0.5">
            <Pressable onPress={() => setActiveTab('uniform')}>
              <View
                className={`rounded-3xl p-3 px-6 ${activeTab === 'uniform' ? `bg-[#238c58]` : ''}`}
                style={{ borderRadius: 12 }}>
                <Text
                  className={`text-lg font-semibold ${activeTab !== 'uniform' ? 'text-black' : 'text-white'}`}>
                  Uniform Request
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setActiveTab('leave')}>
              <View
                className={`rounded-3xl p-3 px-6 ${activeTab === 'leave' ? `bg-[#238c58]` : ''}`}
                style={{ borderRadius: 12 }}>
                <Text
                  className={`text-lg font-semibold ${activeTab !== 'leave' ? 'text-black' : 'text-white'}`}>
                  Leave Request
                </Text>
              </View>
            </Pressable>
          </View>

          <ScrollView className="flex-1 px-4">
            {activeTab === 'uniform'
              ? filteredUniformRequests.map((req, i) => renderRequestCard(req, 'uniform', true, i))
              : filteredLeaveRequests.map((req, i) => renderRequestCard(req, 'leave', true, i))}
          </ScrollView>
        </>
      )}

      {!readOnly && renderAddModal()}
      {!readOnly && renderEditModal()}
      {!readOnly && renderDeleteModal()}
      {!readOnly && renderAcceptModal()}
      {!readOnly && renderRejectModal()}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}>
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={{ height: '90%' }}>
            <View className="rounded-t-1xl flex-1 bg-white p-6">
              <View className="mb-4 flex-row justify-around rounded-2xl bg-gray-200 p-0.5">
                <Pressable onPress={() => setActiveTab('uniform')} style={{ flex: 1 }}>
                  <View
                    style={{
                      borderRadius: 12,
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      backgroundColor:
                        activeTab === 'uniform' ? configFile.colorGreen : 'transparent',
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: activeTab === 'uniform' ? 'white' : 'black',
                      }}>
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
                      backgroundColor:
                        activeTab === 'leave' ? configFile.colorGreen : 'transparent',
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: activeTab === 'leave' ? 'white' : 'black',
                      }}>
                      Leave Request
                    </Text>
                  </View>
                </Pressable>
              </View>
              <ScrollView className="flex-1">
                {activeTab === 'uniform'
                  ? uniformRequests
                      .filter((r) => r.status === 'Active')
                      .map((req, i) => renderRequestCard(req, 'uniform', true, i))
                  : leaveRequests
                      .filter((r) => r.status === 'Approved' && r.approvedBy)
                      .map((req, i) => renderRequestCard(req, 'leave', true, i))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default RequestsScreen;
