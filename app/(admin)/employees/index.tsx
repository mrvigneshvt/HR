import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { configFile } from '../../../config';
import SearchBar from '../../../components/search';
import axios from 'axios';
import { isReadOnlyRole } from 'utils/roleUtils';
import { BackHandler } from 'react-native';
import { router } from 'expo-router';
import EmployeeIdCard from '../../../components/EmployeeIdCardFront';
import EmployeeIdCardDetail from '../../../components/employeeIdCardDetails';
import { Api } from 'class/HandleApi';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import { differenceInYears, format } from 'date-fns';
import DashTop from 'components/DashTop';
import { NavRouter } from 'class/Router';
import { Image } from 'expo-image';
import { scale } from 'react-native-size-matters';
import Verified from 'components/Verified';
import DropDownPicker from 'react-native-dropdown-picker';
import { State } from 'class/State';
import PaginatedComponent from 'components/Pagination';
import SearchOverlayComponent from 'components/SearchOverlay';
import { company } from 'Memory/Token';
import EntityDropdown from 'components/DropDown';
import { Colors } from 'class/Colors';
const { width: screenWidth } = Dimensions.get('window');
const BASE_URL = 'https://sdce.lyzooapp.co.in:31313/api';

export interface Employee {
  employee_id: string;
  name: string;
  father_spouse_name: string;
  guardian_name: string;
  dob: string;
  gender: 'Male' | 'Female';
  age: number | null;
  marital_status: string;
  aadhaar_number: string;
  is_aadhaar_verified: boolean;
  mobile_verified: boolean;
  profile_image: string;
  contact_email: string;
  contact_mobile_no: string;
  emergency_contact_name: string;
  emergencyContact: string;
  emergency_contact_phone: string;
  address_country: string;
  address_state: string;
  address_district: string;
  address_po: string;
  address_street: string;
  address_house: string;
  address_landmark: string;
  address_zip: string;
  communication_address: string;
  date_of_joining: string;
  role: string;
  department: string;
  designation: string;
  branch: string;
  reporting: string;
  reference_id: string;
  account_number: string;
  ifsc: string;
  bank_name: string;
  name_at_bank: string;
  bank_branch: string;
  is_bank_verified: boolean;
  uan_number: string;
  esi_number: string;
  esi_card: string;
  pan_number: string;
  pan_card: string;
  driving_license: string;
  driving_license_card: string;
  status: string;
}

interface FormErrors {
  employee_id?: string;
  name?: string;
  father_spouse_name?: string;
  guardian_name?: string;
  dob?: string;
  gender?: string;
  age?: string;
  marital_status?: string;
  aadhaar_number?: string;
  is_aadhaar_verified?: string;
  mobile_verified?: string;
  profile_image?: string;
  contact_email?: string;
  contact_mobile_no?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address_country?: string;
  address_state?: string;
  address_district?: string;
  address_po?: string;
  address_street?: string;
  address_house?: string;
  address_landmark?: string;
  address_zip?: string;
  communication_address?: string;
  date_of_joining?: string;
  role?: string;
  department?: string;
  designation?: string;
  branch?: string;
  reporting?: string;
  reference_id?: string;
  account_number?: string;
  ifsc?: string;
  bank_name?: string;
  name_at_bank?: string;
  bank_branch?: string;
  is_bank_verified?: string;
  uan_number?: string;
  esi_number?: string;
  esi_card?: string;
  pan_number?: string;
  pan_card?: string;
  driving_license?: string;
  driving_license_card?: string;
  status?: string;
}

const initialEmployeeState: Employee = {
  employee_id: '',
  name: '',
  father_spouse_name: '',
  guardian_name: '',
  dob: '',
  gender: 'Male',
  age: null,
  marital_status: '',
  aadhaar_number: '',
  is_aadhaar_verified: false,
  mobile_verified: false,
  profile_image: '',
  contact_email: '',
  contact_mobile_no: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergencyContact: '',
  address_country: '',
  address_state: '',
  address_district: '',
  address_po: '',
  address_street: '',
  address_house: '',
  address_landmark: '',
  address_zip: '',
  communication_address: '',
  date_of_joining: '',
  role: '',
  department: '',
  designation: '',
  branch: '',
  reporting: '',
  reference_id: '',
  account_number: '',
  ifsc: '',
  bank_name: '',
  name_at_bank: '',
  bank_branch: '',
  is_bank_verified: false,
  uan_number: '',
  esi_number: '',
  esi_card: '',
  pan_number: '',
  pan_card: '',
  driving_license: '',
  driving_license_card: '',
  status: 'Active',
};

const EmployeesScreen = () => {
  const params = useLocalSearchParams();
  const isFocus = useIsFocused();

  const role = params.role as string | undefined;
  console.log(role, 'role');
  const empId = params.empId as string | undefined;
  const company = params.company as 'sdce' | 'sq';
  const readOnly = isReadOnlyRole(role);
  console.log('EmployeesScreen readOnly:', readOnly, 'role:', role);

  const [token, setToken] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [filteredList, setFilteredList] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<Employee>(initialEmployeeState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [Company, setCompany] = useState<company>('sdce');

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusDrop, setStatusDrop] = useState([
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ]);

  const [roleOpen, setRoleOpen] = useState(false);
  const [roleDrop, setRoleDrop] = useState([
    { label: 'SuperAdmin', value: 'SuperAdmin' },
    { label: 'Employee', value: 'Employee' },

    { label: 'Admin', value: 'Admin' },
    { label: 'Executive', value: 'Executive' },
    { label: 'Manager', value: 'Manager' },
  ]);
  useEffect(() => {
    const Token = State.getToken();
    if (Token) {
      setToken(Token);
    }
    fetchEmployees();
  }, [isFocus]);

  const switchCompany = () => {
    setCompany(Company == 'sdce' ? 'sq' : 'sdce');
  };

  const setReporting = (value) => {
    console.log('invoking setReporting: ', value);
    setNewEmployee((pre) => ({ ...pre, reporting: value }));
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      console.log('Fetching employees...');

      const response = await axios.get(`${BASE_URL}/employees`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      // console.log('Fetch Response:', response.data);

      if (response.data && Array.isArray(response.data)) {
        setEmployeeList(response.data);
        setFilteredList(response.data);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setEmployeeList(response.data.data);
        setFilteredList(response.data.data);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error: any) {
      console.error('Fetch Employees Error:', error);
      console.error('Error Response:', error.response?.data);

      let errorMessage = 'Failed to fetch employees. Please try again.';

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your internet connection.';
      } else if (error.message) {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   setFilteredList(
  //     employeeList.filter((emp) => {
  //       if (emp.name && emp.employee_id) {
  //         return (
  //           emp.name.toLowerCase().includes(search.toLowerCase()) ||
  //           emp.employee_id.toLowerCase().includes(search.toLowerCase())
  //         );
  //       }
  //       return false; // ignore this emp if any required field is missing
  //     })
  //   );
  // }, [search, employeeList]);

  useEffect(() => {
    console.log('Selected Emp 4 Update: ', selectedEmployee);
  }, [selectedEmployee]);

  useEffect(() => {
    console.log('Selected new EMp: ', newEmployee);
  }, [newEmployee]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // ✅ Required Fields Only
    if (!newEmployee.employee_id?.trim()) {
      newErrors.employee_id = 'Employee ID is required';
    } else if (!/^[A-Z0-9]{3,10}$/.test(newEmployee.employee_id)) {
      newErrors.employee_id = 'Employee ID must be 3-10 characters (letters and numbers only)';
    }

    if (!newEmployee.aadhaar_number?.trim()) {
      newErrors.aadhaar_number = 'Aadhaar number is required';
    } else if (!/^\d{12}$/.test(newEmployee.aadhaar_number)) {
      newErrors.aadhaar_number = 'Aadhaar number must be 12 digits';
    }

    if (!newEmployee.contact_email?.trim()) {
      newErrors.contact_email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newEmployee.contact_email)) {
      newErrors.contact_email = 'Invalid email format';
    }

    if (!newEmployee.contact_mobile_no?.trim()) {
      newErrors.contact_mobile_no = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(newEmployee.contact_mobile_no)) {
      newErrors.contact_mobile_no = 'Mobile number must be 10 digits starting with 6-9';
    }

    if (!newEmployee.emergency_contact_phone?.trim()) {
      newErrors.emergency_contact_phone = 'Emergency contact phone is required';
    } else if (!/^[6-9]\d{9}$/.test(newEmployee.emergency_contact_phone)) {
      newErrors.emergency_contact_phone = 'Emergency contact must be 10 digits starting with 6-9';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const ValidateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!newEmployee.employee_id?.trim()) {
      newErrors.employee_id = 'Employee ID is required';
    } else if (!/^[A-Z0-9]{3,10}$/.test(newEmployee.employee_id)) {
      newErrors.employee_id = 'Employee ID must be 3-10 characters (letters and numbers only)';
    }
    // if (!newEmployee.name?.trim()) {
    //   newErrors.name = 'Name is required';
    // }
    // if (!newEmployee.father_spouse_name?.trim()) {
    //   newErrors.father_spouse_name = 'Father/Spouse Name is required';
    // }
    // if (!newEmployee.guardian_name?.trim()) {
    //   newErrors.guardian_name = 'Guardian Name is required';
    // }
    // if (!newEmployee.dob?.trim()) {
    //   newErrors.dob = 'Date of Birth is required';
    // } else
    // if (!/^\d{4}-\d{2}-\d{2}$/.test(newEmployee.dob)) {
    //   newErrors.dob = 'Date of Birth must be in YYYY-MM-DD format';
    // }
    // if (!newEmployee.gender) {
    //   newErrors.gender = 'Gender is required';
    // }
    // if (newEmployee.age === null || isNaN(Number(newEmployee.age))) {
    //   newErrors.age = 'Age is required';
    // }
    // if (!newEmployee.marital_status?.trim()) {
    //   newErrors.marital_status = 'Marital Status is required';
    // }
    if (!newEmployee.aadhaar_number?.trim()) {
      newErrors.aadhaar_number = 'Aadhaar number is required';
    } else if (!/^\d{12}$/.test(newEmployee.aadhaar_number)) {
      newErrors.aadhaar_number = 'Aadhaar number must be 12 digits';
    }
    // if (typeof newEmployee.is_aadhaar_verified !== 'boolean') {
    //   newErrors.is_aadhaar_verified = 'Aadhaar verified is required';
    // }
    // if (typeof newEmployee.mobile_verified !== 'boolean') {
    //   newErrors.mobile_verified = 'Mobile verified is required';
    // }
    if (!newEmployee.contact_email?.trim()) {
      newErrors.contact_email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newEmployee.contact_email)) {
      newErrors.contact_email = 'Invalid email format';
    }
    if (!newEmployee.contact_mobile_no?.trim()) {
      newErrors.contact_mobile_no = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(newEmployee.contact_mobile_no)) {
      newErrors.contact_mobile_no = 'Mobile number must be 10 digits starting with 6-9';
    }
    // if (!newEmployee.emergency_contact_name?.trim()) {
    //   newErrors.emergency_contact_name = 'Emergency contact name is required';
    // }
    if (!newEmployee.emergency_contact_phone?.trim()) {
      newErrors.emergency_contact_phone = 'Emergency contact phone is required';
    } else if (!/^[6-9]\d{9}$/.test(newEmployee.emergency_contact_phone)) {
      newErrors.emergency_contact_phone = 'Emergency contact must be 10 digits starting with 6-9';
    }
    // if (!newEmployee.address_country?.trim()) {
    //   newErrors.address_country = 'Country is required';
    // }
    // if (!newEmployee.address_state?.trim()) {
    //   newErrors.address_state = 'State is required';
    // }
    // if (!newEmployee.address_district?.trim()) {
    //   newErrors.address_district = 'District is required';
    // }
    // if (!newEmployee.address_po?.trim()) {
    //   newErrors.address_po = 'Post Office is required';
    // }
    // if (!newEmployee.address_street?.trim()) {
    //   newErrors.address_street = 'Street is required';
    // }
    // if (!newEmployee.address_house?.trim()) {
    //   newErrors.address_house = 'House number is required';
    // }
    // if (!newEmployee.address_landmark?.trim()) {
    //   newErrors.address_landmark = 'Landmark is required';
    // }
    // if (!newEmployee.address_zip?.trim()) {
    //   newErrors.address_zip = 'ZIP code is required';
    // } else if (!/^\d{6}$/.test(newEmployee.address_zip)) {
    //   newErrors.address_zip = 'ZIP code must be 6 digits';
    // }
    // if (!newEmployee.communication_address?.trim()) {
    //   newErrors.communication_address = 'Communication address is required';
    // }
    // if (!newEmployee.date_of_joining?.trim()) {
    //   newErrors.date_of_joining = 'Date of joining is required';
    // } else if (!/^\d{4}-\d{2}-\d{2}$/.test(newEmployee.date_of_joining)) {
    //   newErrors.date_of_joining = 'Date of joining must be in YYYY-MM-DD format';
    // }
    // if (!newEmployee.role?.trim()) {
    //   newErrors.role = 'Role is required';
    // }
    // if (!newEmployee.department?.trim()) {
    //   newErrors.department = 'Department is required';
    // }
    // if (!newEmployee.designation?.trim()) {
    //   newErrors.designation = 'Designation is required';
    // }
    // if (!newEmployee.branch?.trim()) {
    //   newErrors.branch = 'Branch is required';
    // }
    // if (!newEmployee.reporting?.trim()) {
    //   newErrors.reporting = 'Reporting manager is required';
    // }
    // if (!newEmployee.reference_id?.trim()) {
    //   newErrors.reference_id = 'Reference ID is required';
    // }
    // if (!newEmployee.account_number?.trim()) {
    //   newErrors.account_number = 'Account number is required';
    // }
    // if (!newEmployee.ifsc?.trim()) {
    //   newErrors.ifsc = 'IFSC code is required';
    // }
    // if (!newEmployee.bank_name?.trim()) {
    //   newErrors.bank_name = 'Bank name is required';
    // }
    // if (!newEmployee.name_at_bank?.trim()) {
    //   newErrors.name_at_bank = 'Name at bank is required';
    // }
    // if (!newEmployee.bank_branch?.trim()) {
    //   newErrors.bank_branch = 'Bank branch is required';
    // }
    // if (typeof newEmployee.is_bank_verified !== 'boolean') {
    //   newErrors.is_bank_verified = 'Bank verified is required';
    // }
    // if (!newEmployee.uan_number?.trim()) {
    //   newErrors.uan_number = 'UAN number is required';
    // }
    // if (!newEmployee.esi_number?.trim()) {
    //   newErrors.esi_number = 'ESI number is required';
    // }
    // if (!newEmployee.esi_card?.trim()) {
    //   newErrors.esi_card = 'ESI card is required';
    // }
    // if (!newEmployee.pan_number?.trim()) {
    //   newErrors.pan_number = 'PAN number is required';
    // }
    // if (!newEmployee.pan_card?.trim()) {
    //   newErrors.pan_card = 'PAN card is required';
    // }
    // if (!newEmployee.driving_license?.trim()) {
    //   newErrors.driving_license = 'Driving license is required';
    // }
    // if (!newEmployee.driving_license_card?.trim()) {
    //   newErrors.driving_license_card = 'Driving license card is required';
    // }
    // if (!newEmployee.status?.trim()) {
    //   newErrors.status = 'Status is required';
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  console.log(errors, '/thialkaerrors');

  const validatePayload = () => {
    const keys: Partial<Employee> = {};

    for (const key in newEmployee) {
      const value = newEmployee[key as keyof Employee];
      if (value !== '' && value !== null && value !== undefined) {
        keys[key as keyof Employee] = value;
      }
    }

    return keys;
  };

  const handleAddEmployee = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    try {
      setLoading(true);
      const employeeData = validatePayload();
      console.log(employeeData, '/////Payload');
      const response = await axios.post(`${BASE_URL}/employees`, employeeData, {
        headers: {
          'Content-Type': 'application/json',
          token,
          Accept: 'application/json',
        },
      });
      if (response.data) {
        Alert.alert('Success', 'Employee added successfully');
        setNewEmployee(initialEmployeeState);
        setShowAddModal(false);
        setErrors({});
        fetchEmployees();
      } else {
        throw new Error(response.data.message || 'Failed to add employee');
      }
    } catch (error: any) {
      let errorMessage = 'Failed to add employee. Please try again.';
      if (error.response) {
        errorMessage = error.response.data?.error || errorMessage;
      } else if (error.request) {
        ///Update Fields
        errorMessage = 'No response from server. Please check your internet connection.';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async () => {
    console.log('Comes Under Del', selectedEmployee);
    if (!selectedEmployee) return;

    try {
      setLoading(true);

      const url = `${BASE_URL}/employees/${selectedEmployee.employee_id}`;
      const data = await Api.handleApi({ url, type: 'DELETE', token });

      switch (data.status) {
        case 200:
          setEmployeeList(
            employeeList.filter((emp) => emp.employee_id !== selectedEmployee.employee_id)
          );

          Alert.alert('Success', 'Employee Delete successfully');

          setShowDeleteModal(false);
          setSelectedEmployee(null);
          fetchEmployees();

          return;

        case 404:
          Alert.alert('Failed', 'Employee not Found');

          return;

        case 500:
          Alert.alert('Failed', 'Internal Server Error');

          return;
      }
      // console.log(data, 'deletrDartaaaaaaaaaaaaaa');
    } catch (error) {
      console.log('error in delete EMP::', error);
      Alert.alert('Error', 'Failed to delete employee');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    console.log(employee, '/////EMP');
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleViewEmployee = (employee: Employee) => {
    console.log(employee, '/////EMP');
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleUpdateEmployee = async (updateFields: Record<string, any>) => {
    console.log(updateFields, '///Update Fields');
    if (!selectedEmployee) return;

    try {
      setLoading(true);

      updateFields = {
        ...updateFields,
        dob: updateFields.dob.split('T')[0] || updateFields.dob,
        updated_at: updateFields.updated_at.split('T')[0] || updateFields.updated_at,
      };

      console.log(updateFields, '///');

      // const response = await axios.put(
      //   `${BASE_URL}/employees/${selectedEmployee.employee_id}`,
      //   updateFields
      // );

      const response = await Api.handleApi({
        url: `${BASE_URL}/employees/${selectedEmployee.employee_id}`,
        type: 'PUT',
        token,
        payload: updateFields,
      });

      console.log('Response:', response.status, response.data);

      Alert.alert(response.status == 200 ? 'Success' : 'Failed', response.data.message);

      if (response.status == 200) {
        setShowEditModal(false);
        setSelectedEmployee(null);
        fetchEmployees();

        router.replace({
          pathname: '/(admin)/employees/',
          params: {
            role,
            empId,
          },
        });
        return;
      }
    } catch (error: any) {
      Alert.alert('Error', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEmployeeCard = ({ item }: { item: Employee }) => (
    <View
      key={item.employee_id}
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: configFile.colorGreen }}>
          {item?.name || 'Not Assigned'}
        </Text>
        <Text style={{ color: 'gray' }}>ID: {item.employee_id}</Text>
        {role?.toLocaleLowerCase() == 'superadmin' && (
          <Text style={{ color: 'gray' }}>Role: {item.role}</Text>
        )}
        <Text style={{ color: 'gray' }}>Department: {item.department}</Text>
      </View>
      {!readOnly && (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable onPress={() => handleViewEmployee(item)}>
            {/* <FontAwesome name="street-view" size={20} color="#4A90E2" /> */}
            <MaterialIcons name="edit" size={20} color="#4A90E2" />
          </Pressable>
          <Pressable
            onPress={() => {
              console.log(item, 'ITEMmmmm');
              setSelectedEmployee(item);
              setShowDeleteModal(true);
            }}>
            <MaterialIcons name="delete" size={20} color="#FF6B6B" />
          </Pressable>
        </View>
      )}
      {/* <TouchableOpacity onPress={() => setSelectedEmployee(item)}>
        <MaterialIcons name="badge" size={24} color="#4A90E2" />
      </TouchableOpacity> */}
    </View>
  );

  const renderAddModal = () => (
    <Modal
      visible={showAddModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowAddModal(false)}>
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
        onPress={() => setShowAddModal(false)}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <ScrollView
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: '90%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }} className="text-black">
                Add Employee
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {/* Basic Information */}
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <Text className="text-black">Employee ID *</Text>
            <TextInput
              value={newEmployee.employee_id}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, employee_id: text.toUpperCase() });
                if (errors.employee_id) setErrors({ ...errors, employee_id: undefined });
              }}
              placeholder="Enter employee ID"
              placeholderTextColor="#b9b9b9"
              style={[styles.input, errors.employee_id && styles.inputError]}
              className="text-[#3b3b36]"
            />
            {errors.employee_id && <Text style={styles.errorText}>{errors.employee_id}</Text>}
            <Text className="text-black">Name </Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.name}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, name: text });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Enter name"
              style={[styles.input, errors.name && styles.inputError]}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            <Text className="text-black">Gender </Text>
            <View style={styles.radioGroup}>
              <Pressable
                style={[
                  styles.radioButton,
                  newEmployee.gender === 'Male' && styles.radioButtonSelected,
                ]}
                onPress={() => {
                  setNewEmployee({ ...newEmployee, gender: 'Male' });
                  if (errors.gender) setErrors({ ...errors, gender: undefined });
                }}>
                <FontAwesome name="male" size={24} color="green" />
              </Pressable>
              <Pressable
                style={[
                  styles.radioButton,
                  newEmployee.gender === 'Female' && styles.radioButtonSelected,
                ]}
                onPress={() => {
                  setNewEmployee({ ...newEmployee, gender: 'Female' });
                  if (errors.gender) setErrors({ ...errors, gender: undefined });
                }}>
                <FontAwesome name="female" size={24} color="#be25ab" />
              </Pressable>
            </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
            <Text className="text-black">Father/Spouse Name</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.father_spouse_name}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, father_spouse_name: text })}
              placeholder="Enter father/spouse name"
              style={styles.input}
            />
            <View className="flex-row">
              <Text className="text-black" numberOfLines={1}>
                Date of Birth
              </Text>
              <TouchableOpacity
                className="text-black"
                onPress={() => {
                  console.log();
                  setShowCalendar(true);
                }}>
                <AntDesign name="calendar" size={24} color="green" />
              </TouchableOpacity>
            </View>
            {showCalendar && (
              <DateTimePicker
                value={new Date()}
                maximumDate={new Date()}
                className="text-black"
                mode="date"
                display="calendar"
                onChange={(e, selectedDate) => {
                  if (e.type === 'dismissed') {
                    setShowCalendar(false);
                    return;
                  }

                  if (selectedDate) {
                    const formatted = format(selectedDate, 'yyyy-MM-dd');
                    const age = differenceInYears(new Date(), new Date(formatted));

                    setNewEmployee((prev) => ({
                      ...prev,
                      dob: formatted,
                      age: age.toString(),
                    }));

                    setShowCalendar(false); // close picker
                    // console.log('DOB updated to:', formatted, 'Age:', age);
                  }
                }}
              />
            )}
            <TextInput
              editable={false}
              value={newEmployee.dob || ''}
              // onChangeText={(text) => setNewEmployee({ ...newEmployee, dob: text })}
              placeholder="YYYY-MM-DD"
              style={styles.input}
              className=""
            />
            <Text className="text-black">Age</Text>
            <TextInput
              editable={false}
              value={newEmployee.age?.toString() || ''}
              onChangeText={(text) =>
                setNewEmployee({ ...newEmployee, age: parseInt(text) || null })
              }
              placeholder="Enter age"
              keyboardType="numeric"
              style={styles.input}
            />
            {/* Contact Information */}
            <Text style={styles.sectionTitle} className="text-black">
              Contact Information
            </Text>
            <Text className="text-black">Email *</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.contact_email}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, contact_email: text });
                if (errors.contact_email) setErrors({ ...errors, contact_email: undefined });
              }}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, errors.contact_email && styles.inputError]}
            />
            {errors.contact_email && <Text style={styles.errorText}>{errors.contact_email}</Text>}
            <Text className="text-black">Mobile Number *</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.contact_mobile_no}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, contact_mobile_no: text });
                if (errors.contact_mobile_no)
                  setErrors({ ...errors, contact_mobile_no: undefined });
              }}
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              style={[styles.input, errors.contact_mobile_no && styles.inputError]}
            />
            {errors.contact_mobile_no && (
              <Text style={styles.errorText}>{errors.contact_mobile_no}</Text>
            )}
            <Text className="text-black">Emergency Contact Name </Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.emergency_contact_name}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, emergency_contact_name: text });
                if (errors.emergency_contact_name)
                  setErrors({ ...errors, emergency_contact_name: undefined });
              }}
              placeholder="Enter emergency contact name"
              style={[styles.input, errors.emergency_contact_name && styles.inputError]}
            />
            {errors.emergency_contact_name && (
              <Text style={styles.errorText}>{errors.emergency_contact_name}</Text>
            )}
            <Text className="text-black">Emergency Contact Phone *</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.emergency_contact_phone}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, emergency_contact_phone: text });
                if (errors.emergency_contact_phone)
                  setErrors({ ...errors, emergency_contact_phone: undefined });
              }}
              placeholder="Enter emergency contact"
              keyboardType="phone-pad"
              maxLength={10}
              style={[styles.input, errors.emergency_contact_phone && styles.inputError]}
            />
            {errors.emergency_contact_phone && (
              <Text style={styles.errorText}>{errors.emergency_contact_phone}</Text>
            )}
            {/* Address Information */}
            <Text style={styles.sectionTitle}>Address Information</Text>
            <Text className="text-black">Country</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.address_country}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_country: text })}
              placeholder="Enter country"
              style={styles.input}
            />
            <Text className="text-black">State</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.address_state}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_state: text })}
              placeholder="Enter state"
              style={styles.input}
            />
            <Text className="text-black">District</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.address_district}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_district: text })}
              placeholder="Enter district"
              style={styles.input}
            />
            <Text className="text-black">Post Office</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.address_po}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_po: text })}
              placeholder="Enter post office"
              style={styles.input}
            />
            <Text className="text-black">Street</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.address_street}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_street: text })}
              placeholder="Enter street"
              style={styles.input}
            />
            <Text className="text-black">House Number</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.address_house}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_house: text })}
              placeholder="Enter house number"
              style={styles.input}
            />
            <Text className="text-black">Landmark</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.address_landmark}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_landmark: text })}
              placeholder="Enter landmark"
              style={styles.input}
            />
            <Text className="text-black">ZIP Code</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.address_zip}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_zip: text })}
              placeholder="Enter ZIP code"
              keyboardType="numeric"
              style={styles.input}
            />
            {/* Employment Information */}
            <Text style={styles.sectionTitle}>Employment Information</Text>
            <Text className="text-black">Role </Text>
            <DropDownPicker
              open={roleOpen}
              value={newEmployee?.role || 'Employee'}
              items={roleDrop}
              setOpen={setRoleOpen}
              setValue={(callback) => {
                const newValue = callback(newEmployee?.role);
                if (newEmployee) {
                  setNewEmployee({ ...newEmployee, role: newValue });
                }
              }}
              setItems={setRoleDrop}
              placeholder="Select role"
              style={{ backgroundColor: 'white', borderColor: '#ccc' }}
              dropDownContainerStyle={{ backgroundColor: 'white' }}
              textStyle={{ color: '#3b3b36' }}
            />

            {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
            <Text className="text-black">Department </Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.department}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, department: text });
                if (errors.department) setErrors({ ...errors, department: undefined });
              }}
              placeholder="Enter department"
              style={[styles.input, errors.department && styles.inputError]}
            />
            {errors.department && <Text style={styles.errorText}>{errors.department}</Text>}
            <Text className="text-black">Designation </Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.designation}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, designation: text });
                if (errors.designation) setErrors({ ...errors, designation: undefined });
              }}
              placeholder="Enter designation"
              style={[styles.input, errors.designation && styles.inputError]}
            />
            {errors.designation && <Text style={styles.errorText}>{errors.designation}</Text>}
            <Text className="text-black">Branch </Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.branch}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, branch: text });
                if (errors.branch) setErrors({ ...errors, branch: undefined });
              }}
              placeholder="Enter branch"
              style={[styles.input, errors.branch && styles.inputError]}
            />
            {errors.branch && <Text style={styles.errorText}>{errors.branch}</Text>}
            <Text className="text-black">Reporting Manager </Text>
            {/* <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.reporting}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, reporting: text });
                if (errors.reporting) setErrors({ ...errors, reporting: undefined });
              }}
              placeholder="Enter reporting manager"
              style={[styles.input, errors.reporting && styles.inputError]}
            /> */}
            <EntityDropdown
              type="employee"
              selected={newEmployee.reporting} // 👈 syncs selected employee_id
              setState={setReporting}
              placeholder="Select reporting employee"
              containerStyle={{ backgroundColor: '#fff' }}
              inputStyle={{
                backgroundColor: '#fff',
                borderColor: '#ccc',
                color: '#000',
              }}
              listStyle={{
                backgroundColor: '#f9f9f9',
                borderColor: '#ddd',
                borderWidth: 1,
              }}
              itemStyle={{
                backgroundColor: '#fff',
                borderBottomColor: '#eee',
              }}
              itemTextStyle={{
                color: '#000',
              }}
            />

            {errors.reporting && <Text style={styles.errorText}>{errors.reporting}</Text>}
            {/* Document Information */}
            <Text style={styles.sectionTitle}>Document Information</Text>
            <Text className="text-black">Aadhaar Number *</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.aadhaar_number}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, aadhaar_number: text });
                if (errors.aadhaar_number) setErrors({ ...errors, aadhaar_number: undefined });
              }}
              placeholder="Enter Aadhaar number"
              keyboardType="numeric"
              maxLength={12}
              style={[styles.input, errors.aadhaar_number && styles.inputError]}
            />
            {errors.aadhaar_number && <Text style={styles.errorText}>{errors.aadhaar_number}</Text>}
            <Text className="text-black">PAN Number</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.pan_number}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, pan_number: text })}
              placeholder="Enter PAN number"
              style={styles.input}
            />
            <Text className="text-black">Driving License</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.driving_license}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, driving_license: text })}
              placeholder="Enter driving license"
              style={styles.input}
            />
            {/* Bank Information */}
            <Text style={styles.sectionTitle} className="text-black">
              Bank Information
            </Text>
            <Text className="text-black">Bank Name</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.bank_name}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, bank_name: text })}
              placeholder="Enter bank name"
              style={styles.input}
            />
            <Text className="text-black">Account Number</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.account_number}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, account_number: text })}
              placeholder="Enter account number"
              keyboardType="numeric"
              style={styles.input}
            />
            <Text className="text-black">IFSC Code</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.ifsc}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, ifsc: text })}
              placeholder="Enter IFSC code"
              style={styles.input}
            />
            <Text className="text-black">Account Holder Name</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.name_at_bank}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, name_at_bank: text })}
              placeholder="Enter account holder name"
              style={styles.input}
            />
            {/* is_aadhaar_verified (Switch) */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ marginRight: 8 }} className="text-black">
                Aadhaar Verified
              </Text>
              <Pressable
                onPress={() =>
                  setNewEmployee({
                    ...newEmployee,
                    is_aadhaar_verified: !newEmployee.is_aadhaar_verified,
                  })
                }
                style={{
                  width: 40,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: newEmployee.is_aadhaar_verified ? '#4A90E2' : '#ccc',
                  justifyContent: 'center',
                  alignItems: newEmployee.is_aadhaar_verified ? 'flex-end' : 'flex-start',
                  padding: 2,
                }}>
                <View
                  style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'white' }}
                />
              </Pressable>
            </View>
            {/* Profile Image */}
            {/* <Text>Profile Image</Text>
            <TextInput
              value={newEmployee.profile_image}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, profile_image: text })}
              placeholder="Enter profile image URL or leave blank"
              style={styles.input}
            /> */}
            {/* Communication Address */}
            <Text className="text-black">Communication Address</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.communication_address}
              onChangeText={(text) =>
                setNewEmployee({ ...newEmployee, communication_address: text })
              }
              placeholder="Enter communication address"
              style={styles.input}
            />
            {/* Date of Joining */}
            <Text className="text-black">Date of Joining</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              editable={false}
              value={newEmployee.date_of_joining}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, date_of_joining: text })}
              placeholder="YYYY-MM-DD"
              style={styles.input}
            />
            {/* Reference ID */}
            <Text className="text-black">Reference ID</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.reference_id}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, reference_id: text })}
              placeholder="Enter reference ID"
              style={styles.input}
            />
            {/* mobile_verified (Switch) */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ marginRight: 8 }} className="text-black">
                Mobile Verified
              </Text>
              <Pressable
                onPress={() =>
                  setNewEmployee({ ...newEmployee, mobile_verified: !newEmployee.mobile_verified })
                }
                style={{
                  width: 40,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: newEmployee.mobile_verified ? '#4A90E2' : '#ccc',
                  justifyContent: 'center',
                  alignItems: newEmployee.mobile_verified ? 'flex-end' : 'flex-start',
                  padding: 2,
                }}>
                <View
                  style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'white' }}
                />
              </Pressable>
            </View>
            {/* Bank Branch */}
            <Text className="text-black">Bank Branch</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.bank_branch}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, bank_branch: text })}
              placeholder="Enter bank branch"
              style={styles.input}
            />
            {/* Name at Bank */}
            <Text className="text-black">Name at Bank </Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.name_at_bank}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, name_at_bank: text })}
              placeholder="Enter name at bank"
              style={styles.input}
            />
            {/* is_bank_verified (Switch) */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ marginRight: 8 }} className="text-black">
                Bank Verified
              </Text>
              <Pressable
                onPress={() =>
                  setNewEmployee({
                    ...newEmployee,
                    is_bank_verified: !newEmployee.is_bank_verified,
                  })
                }
                style={{
                  width: 40,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: newEmployee.is_bank_verified ? '#4A90E2' : '#ccc',
                  justifyContent: 'center',
                  alignItems: newEmployee.is_bank_verified ? 'flex-end' : 'flex-start',
                  padding: 2,
                }}>
                <View
                  style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'white' }}
                />
              </Pressable>
            </View>
            {/* UAN Number */}
            <Text className="text-black">UAN Number</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.uan_number}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, uan_number: text })}
              placeholder="Enter UAN number"
              style={styles.input}
            />
            {/* ESI Number */}
            <Text className="text-black">ESI Number</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.esi_number}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, esi_number: text })}
              placeholder="Enter ESI number"
              style={styles.input}
            />
            <Text className="text-black">ESI Card</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.esi_card}
              placeholder="Enter ESI card URL"
              style={styles.input}
              editable={false}
            />
            {/* PAN Number */}
            <Text className="text-black">PAN Number</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.pan_number}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, pan_number: text })}
              placeholder="Enter PAN number"
              style={styles.input}
            />
            {/* PAN Card */}
            {/* <Text className="text-black">PAN Card</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.pan_card}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, pan_card: text })}
              placeholder="Enter PAN card URL"
              style={styles.input}
            /> */}
            {/* Driving License */}
            <Text className="text-black">Driving License</Text>
            <TextInput
              placeholderTextColor="#b9b9b9"
              value={newEmployee.driving_license}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, driving_license: text })}
              placeholder="Enter driving license"
              style={styles.input}
            />
            {/* Driving License Card */}
            <Text className="text-black">Driving License Card</Text>
            <TextInput
              value={newEmployee.driving_license_card}
              onChangeText={(text) =>
                setNewEmployee({ ...newEmployee, driving_license_card: text })
              }
              placeholder="Enter driving license card URL"
              style={styles.input}
            />
            {/* Status */}
            <Text className="text-black">Status</Text>
            <DropDownPicker
              open={statusOpen}
              value={newEmployee.status || null}
              items={statusDrop}
              setOpen={setStatusOpen}
              setValue={(callback) => {
                const newValue = callback(newEmployee.status);
                setNewEmployee({ ...newEmployee, status: newValue });
              }}
              setItems={setStatusDrop}
              placeholder="Select status"
              style={{ backgroundColor: 'white', borderColor: '#ccc' }}
              dropDownContainerStyle={{ backgroundColor: 'white' }}
              textStyle={{ color: '#3b3b36' }}
            />

            {/* Add Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleAddEmployee}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Add Employee</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  const handleClose = (from: 'update') => {
    switch (from) {
      case 'update':
        setSelectedEmployee(null);
        setShowCalendar(false);
        setShowEditModal(false);
    }
  };

  useEffect(() => {
    const cleanup = NavRouter.BackHandler({ role, empId, company });
    return cleanup;
  }, []);

  const RenderSwitchIcon = () => (
    <TouchableOpacity onPress={switchCompany}>
      {Company === 'sdce' ? (
        <MaterialIcons name="security" size={24} color="white" />
      ) : (
        <MaterialCommunityIcons name="broom" size={24} color="white" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.get(Company, 'bg') }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Employees',
          headerStyle: {
            backgroundColor: configFile.colorGreen,
          },
          headerTintColor: 'white',
          headerRight: () =>
            !readOnly && (
              <View className="flex flex-row items-center justify-center gap-3">
                {(role?.toLowerCase() === 'superadmin' ||
                  role?.toLowerCase() === 'admin' ||
                  role?.toLowerCase() === 'executive') && (
                  <>
                    <RenderSwitchIcon />
                    <Pressable
                      onPress={() => setShowAddModal(true)}
                      style={{
                        marginRight: 16,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                      }}
                      className="rounded-lg p-1">
                      <Text style={{ color: configFile.colorGreen }}>Add</Text>
                      <MaterialIcons name="add" size={24} color={configFile.colorGreen} />
                    </Pressable>
                  </>
                )}
              </View>
            ),
        }}
      />

      <SearchOverlayComponent
        limit={5}
        childCard={renderEmployeeCard}
        for={Company == 'sdce' ? 'employee' : 'sqemployee'}
        containerStyle={{ marginBottom: 10 }}
        overlayStyle={{ backgroundColor: Colors.get(Company, 'bg') }}
        inputStyle={{ color: 'black' }}
      />
      {/* <SearchBar value={search} onChangeText={setSearch} placeholder="Search employee..." /> */}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={configFile.colorGreen} />
        </View>
      ) : (
        // <FlatList
        //   data={filteredList}
        //   keyExtractor={(item) => item.employee_id}
        //   renderItem={renderEmployeeCard}
        //   contentContainerStyle={{ paddingVertical: 8 }}
        // />
        <PaginatedComponent
          key={'employees'}
          url={
            Company == 'sdce'
              ? configFile.api.superAdmin.app.employees
              : configFile.api.superAdmin.app.sqEmployees
          }
          limit={8}
          renderItem={({ item }) => {
            return renderEmployeeCard({ item });
          }}
          containerStyle={{ backgroundColor: Colors.get(Company, 'bg') }}
        />
      )}

      {!readOnly && renderAddModal()}

      {/* Edit Modal */}
      {!readOnly && showEditModal && (
        <Modal
          visible={showEditModal}
          transparent
          animationType="slide"
          onRequestClose={() => {
            handleClose('update');
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
            onPress={() => setShowEditModal(false)}>
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <ScrollView
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  maxHeight: '90%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}>
                  <Image
                    source={
                      selectedEmployee?.profile_image
                        ? selectedEmployee?.profile_image
                        : require('./../../../assets/profile.png')
                    }
                    style={{
                      height: scale(60),
                      width: scale(60),
                      borderRadius: scale(30),
                      borderWidth: 1,
                      borderColor: '#e5e7eb',
                    }}
                  />
                  {/* <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Edit Employee Details</Text> */}

                  {/* <View></View> */}
                  {/* <DashTop
                    name={selectedEmployee?.name || ''}
                    empId={selectedEmployee?.employee_id || ''}
                    img={selectedEmployee?.profile_image || ''}
                  /> */}

                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
                    Update Employee Details
                  </Text>
                  <TouchableOpacity onPress={() => handleClose('update')}>
                    <MaterialIcons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Basic Information */}
                <Text style={styles.sectionTitle}>Basic Information</Text>
                <Text style={{ color: 'black' }}>Employee ID *</Text>
                <TextInput
                  editable={false}
                  className="text-black"
                  value={selectedEmployee?.employee_id}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, employee_id: text })
                  }
                  placeholder="Enter employee ID"
                  style={[styles.input, errors.employee_id && styles.inputError]}
                />
                {errors.employee_id && <Text style={styles.errorText}>{errors.employee_id}</Text>}

                <Text style={{ color: 'black' }}>Name *</Text>
                <TextInput
                  className="text-black"
                  value={selectedEmployee?.name}
                  onChangeText={(text) =>
                    selectedEmployee && setSelectedEmployee({ ...selectedEmployee, name: text })
                  }
                  placeholder="Enter name"
                  style={[styles.input, errors.name && styles.inputError]}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                <Text style={{ color: 'black' }}>Father/Spouse Name</Text>
                <TextInput
                  className="text-black"
                  value={selectedEmployee?.father_spouse_name}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, father_spouse_name: text })
                  }
                  placeholder="Enter father/spouse name"
                  style={styles.input}
                />

                <Text style={{ color: 'black' }}>Guardian Name</Text>
                <TextInput
                  className="text-black"
                  value={selectedEmployee?.guardian_name}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, guardian_name: text })
                  }
                  placeholder="Enter guardian name"
                  style={styles.input}
                />

                <View className="w-full flex-row ">
                  <Text className="w-" style={{ color: 'black' }} numberOfLines={1}>
                    Date of Birth
                  </Text>
                  <TouchableOpacity
                    className="text-black"
                    onPress={() => {
                      console.log();
                      setShowCalendar(true);
                    }}>
                    <AntDesign name="calendar" size={24} color="green" />
                  </TouchableOpacity>
                </View>

                {showCalendar && (
                  <DateTimePicker
                    value={new Date(selectedEmployee?.dob)}
                    maximumDate={new Date()}
                    className="text-black"
                    mode="date"
                    display="calendar"
                    onChange={(e, selectedDate) => {
                      if (e.type === 'dismissed') {
                        setShowCalendar(false);
                        return;
                      }

                      if (selectedDate) {
                        const formatted = format(selectedDate, 'yyyy-MM-dd');
                        const age = differenceInYears(new Date(), new Date(formatted));

                        setSelectedEmployee((prev) => ({
                          ...prev,
                          dob: formatted,
                          age: age.toString(),
                        }));

                        setShowCalendar(false); // close picker
                        // console.log('DOB updated to:', formatted, 'Age:', age);
                      }
                    }}
                  />
                )}

                {selectedEmployee?.dob && (
                  <TextInput
                    className="text-black"
                    editable={false}
                    value={selectedEmployee?.dob.split('T')[0] || selectedEmployee.dob}
                    onChangeText={(text) =>
                      selectedEmployee && setSelectedEmployee({ ...selectedEmployee, dob: text })
                    }
                    placeholder="YYYY-MM-DD"
                    style={styles.input}
                  />
                )}
                {/* <TextInput
                  editable={false}
                  value={selectedEmployee?.dob}
                  onChangeText={(text) =>
                    selectedEmployee && setSelectedEmployee({ ...selectedEmployee, dob: text })
                  }
                  placeholder="YYYY-MM-DD"
                  style={styles.input}
                />
                */}

                <Text className="text-black">Gender *</Text>
                <View style={styles.radioGroup}>
                  <Pressable
                    style={[
                      styles.radioButton,
                      selectedEmployee?.gender === 'Male' && styles.radioButtonSelected,
                    ]}
                    onPress={() =>
                      selectedEmployee &&
                      setSelectedEmployee({ ...selectedEmployee, gender: 'Male' })
                    }>
                    <FontAwesome name="male" size={24} color="green" />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.radioButton,
                      selectedEmployee?.gender === 'Female' && styles.radioButtonSelectedFemale,
                    ]}
                    onPress={() =>
                      selectedEmployee &&
                      setSelectedEmployee({ ...selectedEmployee, gender: 'Female' })
                    }>
                    <FontAwesome name="female" size={24} color="#be25ab" />
                  </Pressable>
                </View>
                {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

                <Text className="text-black">Age</Text>
                <TextInput
                  className="text-black"
                  editable={false}
                  value={selectedEmployee?.age?.toString() || ''}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, age: parseInt(text) || null })
                  }
                  placeholder="Enter age"
                  keyboardType="numeric"
                  style={styles.input}
                />

                <Text className="text-black">Marital Status</Text>
                <TextInput
                  className="text-black"
                  value={selectedEmployee?.marital_status}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, marital_status: text })
                  }
                  placeholder="Enter marital status"
                  style={styles.input}
                />

                <Text className="text-black">Aadhaar Number *</Text>
                <TextInput
                  className="text-black"
                  editable={false}
                  value={selectedEmployee?.aadhaar_number}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, aadhaar_number: text })
                  }
                  placeholder="Enter Aadhaar number"
                  keyboardType="numeric"
                  maxLength={12}
                  style={[styles.input, errors.aadhaar_number && styles.inputError]}
                />
                {errors.aadhaar_number && (
                  <Text style={styles.errorText}>{errors.aadhaar_number}</Text>
                )}

                {/* is_aadhaar_verified (Switch) */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ marginRight: 8, width: 'auto' }} className="text-black">
                    Aadhaar Verified
                  </Text>
                  {/* <Pressable
                    onPress={() =>
                      selectedEmployee &&
                      setSelectedEmployee({
                        ...selectedEmployee,
                        is_aadhaar_verified: !selectedEmployee.is_aadhaar_verified,
                      })
                    }
                    style={{
                      width: 40,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: selectedEmployee?.is_aadhaar_verified ? '#4A90E2' : '#ccc',
                      justifyContent: 'center',
                      alignItems: selectedEmployee?.is_aadhaar_verified ? 'flex-end' : 'flex-start',
                      padding: 2,
                    }}>
                    <View
                      style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'white' }}
                    />
                  </Pressable> */}
                  {selectedEmployee?.is_aadhaar_verified ? (
                    <Verified verified />
                  ) : (
                    <Verified verified={false} />
                  )}
                </View>

                {/* mobile_verified (Switch) */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ marginRight: 8 }} className="text-black">
                    Mobile Verified
                  </Text>
                  {selectedEmployee?.mobile_verified ? (
                    <Verified verified />
                  ) : (
                    <Verified verified={false} />
                  )}
                  {/* <Pressable
                    onPress={() =>
                      selectedEmployee &&
                      setSelectedEmployee({
                        ...selectedEmployee,
                        mobile_verified: !selectedEmployee.mobile_verified,
                      })
                    }
                    style={{
                      width: 40,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: selectedEmployee?.mobile_verified ? '#4A90E2' : '#ccc',
                      justifyContent: 'center',
                      alignItems: selectedEmployee?.mobile_verified ? 'flex-end' : 'flex-start',
                      padding: 2,
                    }}>
                    <View
                      style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'white' }}
                    />
                  </Pressable> */}
                </View>

                {/* Profile Image */}
                {/* <Text className="text-black">Profile Image</Text>
                <TextInput
                  className="text-black"
                  editable={false}
                  value={selectedEmployee?.profile_image}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, profile_image: text })
                  }
                  placeholder="Enter profile image URL or leave blank"
                  style={styles.input}
                /> */}

                {/* Contact Information */}
                <Text style={styles.sectionTitle} className="text-black">
                  Contact Information
                </Text>
                <Text className="text-black">Email *</Text>
                <TextInput
                  value={selectedEmployee?.contact_email}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, contact_email: text })
                  }
                  placeholder="Enter email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[
                    styles.input,
                    errors.contact_email && styles.inputError,
                    { color: 'black' },
                  ]}
                  className="text-black"
                />
                {errors.contact_email && (
                  <Text style={styles.errorText}>{errors.contact_email}</Text>
                )}

                <Text className="text-black">Mobile Number *</Text>
                <TextInput
                  className="text-black"
                  value={selectedEmployee?.contact_mobile_no}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, contact_mobile_no: text })
                  }
                  placeholder="Enter mobile number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={[styles.input, errors.contact_mobile_no && styles.inputError]}
                />
                {errors.contact_mobile_no && (
                  <Text style={styles.errorText}>{errors.contact_mobile_no}</Text>
                )}

                <Text className="text-black">Emergency Contact Name *</Text>
                <TextInput
                  value={selectedEmployee?.emergency_contact_name}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, emergency_contact_name: text })
                  }
                  placeholder="Enter emergency contact name"
                  style={[styles.input, errors.emergency_contact_name && styles.inputError]}
                  className="text-black"
                />
                {errors.emergency_contact_name && (
                  <Text style={styles.errorText}>{errors.emergency_contact_name}</Text>
                )}

                <Text className="text-black">Emergency Contact Phone *</Text>
                <TextInput
                  value={selectedEmployee?.emergency_contact_phone}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, emergency_contact_phone: text })
                  }
                  placeholder="Enter emergency contact"
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={[styles.input, errors.emergency_contact_phone && styles.inputError]}
                  className="text-black"
                />
                {errors.emergency_contact_phone && (
                  <Text style={styles.errorText}>{errors.emergency_contact_phone}</Text>
                )}

                {/* Address Information */}
                <Text style={styles.sectionTitle} className="text-black">
                  Address Information
                </Text>
                <Text className="text-black">Country</Text>
                <TextInput
                  value={selectedEmployee?.address_country}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, address_country: text })
                  }
                  placeholder="Enter country"
                  style={styles.input}
                  className="text-black"
                />

                <Text className="text-black">State</Text>
                <TextInput
                  value={selectedEmployee?.address_state}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, address_state: text })
                  }
                  placeholder="Enter state"
                  style={styles.input}
                  className="text-black"
                />

                <Text className="text-black">District</Text>
                <TextInput
                  value={selectedEmployee?.address_district}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, address_district: text })
                  }
                  placeholder="Enter district"
                  style={styles.input}
                  className="text-black"
                />

                <Text className="text-black">Post Office</Text>
                <TextInput
                  value={selectedEmployee?.address_po}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, address_po: text })
                  }
                  placeholder="Enter post office"
                  style={styles.input}
                  className="text-black"
                />

                <Text className="text-black">Street</Text>
                <TextInput
                  value={selectedEmployee?.address_street}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, address_street: text })
                  }
                  placeholder="Enter street"
                  style={styles.input}
                  className="text-black"
                />

                <Text className="text-black">House Number</Text>
                <TextInput
                  value={selectedEmployee?.address_house}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, address_house: text })
                  }
                  placeholder="Enter house number"
                  style={styles.input}
                  className="text-black"
                />

                <Text className="text-black">Landmark</Text>
                <TextInput
                  value={selectedEmployee?.address_landmark}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, address_landmark: text })
                  }
                  placeholder="Enter landmark"
                  style={styles.input}
                  className="text-black"
                />

                <Text className="text-black">ZIP Code</Text>
                <TextInput
                  value={selectedEmployee?.address_zip}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, address_zip: text })
                  }
                  placeholder="Enter ZIP code"
                  keyboardType="numeric"
                  style={styles.input}
                  className="text-black"
                />

                {/* Communication Address */}
                <Text className="text-black">Communication Address</Text>
                <TextInput
                  value={selectedEmployee?.communication_address}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, communication_address: text })
                  }
                  placeholder="Enter communication address"
                  style={styles.input}
                  className="text-black"
                />

                {/* Employment Information */}
                <Text style={styles.sectionTitle} className="text-black">
                  Employment Information
                </Text>
                <Text className="text-black">Date of Joining</Text>
                <TextInput
                  value={selectedEmployee?.date_of_joining}
                  editable={false}
                  // onChangeText={(text) =>
                  //   selectedEmployee &&
                  //   setSelectedEmployee({ ...selectedEmployee, date_of_joining: text })
                  // }
                  placeholder="YYYY-MM-DD"
                  style={styles.input}
                  className="text-black"
                />

                {role?.toLocaleLowerCase() == 'superadmin' && (
                  <>
                    <Text className="text-black">Role *</Text>
                    <DropDownPicker
                      open={roleOpen}
                      value={selectedEmployee?.role || null}
                      items={roleDrop}
                      setOpen={setRoleOpen}
                      setValue={(callback) => {
                        const newValue = callback(selectedEmployee?.role);
                        if (selectedEmployee) {
                          setSelectedEmployee({ ...selectedEmployee, role: newValue });
                        }
                      }}
                      setItems={setRoleDrop}
                      placeholder="Select role"
                      style={{ backgroundColor: 'white', borderColor: '#ccc' }}
                      textStyle={{ color: 'black' }}
                      dropDownContainerStyle={{ backgroundColor: 'white' }}
                    />
                    {/* <TextInput
                      value={selectedEmployee?.role}
                      onChangeText={(text) =>
                        selectedEmployee && setSelectedEmployee({ ...selectedEmployee, role: text })
                      }
                      placeholder="Enter role"
                      style={[styles.input, errors.role && styles.inputError]}
                      className="text-black"
                    />
                    {errors.role && <Text style={styles.errorText}>{errors.role}</Text>} */}
                  </>
                )}

                <Text className="text-black">Department *</Text>
                <TextInput
                  value={selectedEmployee?.department}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, department: text })
                  }
                  placeholder="Enter department"
                  style={[styles.input, errors.department && styles.inputError]}
                  className="text-black"
                />
                {errors.department && <Text style={styles.errorText}>{errors.department}</Text>}

                <Text className="text-black">Designation *</Text>
                <TextInput
                  value={selectedEmployee?.designation}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, designation: text })
                  }
                  placeholder="Enter designation"
                  style={[styles.input, errors.designation && styles.inputError]}
                  className="text-black"
                />
                {errors.designation && <Text style={styles.errorText}>{errors.designation}</Text>}

                <Text className="text-black">Branch *</Text>
                <TextInput
                  value={selectedEmployee?.branch}
                  onChangeText={(text) =>
                    selectedEmployee && setSelectedEmployee({ ...selectedEmployee, branch: text })
                  }
                  placeholder="Enter branch"
                  style={[styles.input, errors.branch && styles.inputError]}
                  className="text-black"
                />
                {errors.branch && <Text style={styles.errorText}>{errors.branch}</Text>}

                <Text className="text-black">Reporting Manager *</Text>
                <TextInput
                  value={selectedEmployee?.reporting}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, reporting: text })
                  }
                  placeholder="Enter reporting manager"
                  style={[styles.input, errors.reporting && styles.inputError]}
                  className="text-black"
                />
                {errors.reporting && <Text style={styles.errorText}>{errors.reporting}</Text>}

                <Text className="text-black">Reference ID</Text>
                <TextInput
                  value={selectedEmployee?.reference_id}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, reference_id: text })
                  }
                  placeholder="Enter reference ID"
                  style={styles.input}
                  className="text-black"
                />

                {/* Bank Information */}
                <Text style={styles.sectionTitle} className="text-black">
                  Bank Information
                </Text>
                <Text className="text-black">Account Number</Text>
                <TextInput
                  editable={false}
                  value={selectedEmployee?.account_number}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, account_number: text })
                  }
                  placeholder="Enter account number"
                  keyboardType="numeric"
                  style={styles.input}
                  className="text-black"
                />

                <Text className="text-black">IFSC Code</Text>
                <TextInput
                  editable={false}
                  value={selectedEmployee?.ifsc}
                  onChangeText={(text) =>
                    selectedEmployee && setSelectedEmployee({ ...selectedEmployee, ifsc: text })
                  }
                  placeholder="Enter IFSC code"
                  style={styles.input}
                  className="text-black"
                />

                <Text className="text-black">Bank Name</Text>
                <TextInput
                  editable={false}
                  value={selectedEmployee?.bank_name}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, bank_name: text })
                  }
                  placeholder="Enter bank name"
                  style={styles.input}
                  className="text-black"
                />

                <Text className="text-black">Name at Bank</Text>
                <TextInput
                  editable={false}
                  value={selectedEmployee?.name_at_bank}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, name_at_bank: text })
                  }
                  placeholder="Enter name at bank"
                  style={styles.input}
                  className="text-black"
                />

                <Text className="text-black">Bank Branch</Text>
                <TextInput
                  editable={false}
                  value={selectedEmployee?.bank_branch}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, bank_branch: text })
                  }
                  placeholder="Enter bank branch"
                  style={styles.input}
                  className="text-black"
                />

                {/* is_bank_verified (Switch) */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ marginRight: 8 }} className="text-black">
                    Bank Verified
                  </Text>
                  <Verified verified={selectedEmployee?.is_bank_verified} />
                  {/* <Pressable
                    onPress={() =>
                      selectedEmployee &&
                      setSelectedEmployee({
                        ...selectedEmployee,
                        is_bank_verified: !selectedEmployee.is_bank_verified,
                      })
                    }
                    style={{
                      width: 40,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: selectedEmployee?.is_bank_verified ? '#4A90E2' : '#ccc',
                      justifyContent: 'center',
                      alignItems: selectedEmployee?.is_bank_verified ? 'flex-end' : 'flex-start',
                      padding: 2,
                    }}>
                    <View
                      style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'white' }}
                    />
                  </Pressable> */}
                </View>

                {/* Document Information */}
                <Text style={styles.sectionTitle} className="text-black">
                  Document Information
                </Text>
                <Text className="text-black">UAN Number</Text>
                <TextInput
                  value={selectedEmployee?.uan_number}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, uan_number: text })
                  }
                  placeholder="Enter UAN number"
                  style={styles.input}
                  className="text-black"
                />

                <Text className="text-black">ESI Number</Text>
                <TextInput
                  value={selectedEmployee?.esi_number}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, esi_number: text })
                  }
                  placeholder="Enter ESI number"
                  className="text-black"
                  style={styles.input}
                />

                {/* <Text className="text-black">ESI Card</Text>
                <TextInput
                  value={selectedEmployee?.esi_card}
                  editable={false}
                  onChangeText={(text) =>
                    selectedEmployee && setSelectedEmployee({ ...selectedEmployee, esi_card: text })
                  }
                  placeholder="Enter ESI card URL"
                  style={styles.input}
                  className="text-black"
                /> */}

                <Text className="text-black">PAN Number</Text>
                <TextInput
                  value={selectedEmployee?.pan_number}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, pan_number: text })
                  }
                  placeholder="Enter PAN number"
                  style={styles.input}
                  className="text-black"
                />

                {/* <Text className="text-black">PAN Card</Text>
                <TextInput
                  value={selectedEmployee?.pan_card}
                  onChangeText={(text) =>
                    selectedEmployee && setSelectedEmployee({ ...selectedEmployee, pan_card: text })
                  }
                  placeholder="Enter PAN card URL"
                  style={styles.input}
                  className="text-black"
                /> */}

                <Text className="text-black">Driving License</Text>
                <TextInput
                  value={selectedEmployee?.driving_license}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, driving_license: text })
                  }
                  placeholder="Enter driving license"
                  style={styles.input}
                  className="text-black"
                />

                {/* <Text className="text-black">Driving License Card</Text>
                <TextInput
                  value={selectedEmployee?.driving_license_card}
                  onChangeText={(text) =>
                    selectedEmployee &&
                    setSelectedEmployee({ ...selectedEmployee, driving_license_card: text })
                  }
                  placeholder="Enter driving license card URL"
                  style={styles.input}
                  className="text-black"
                /> */}

                <Text className="text-black">Status</Text>
                {/* <TextInput
                  value={selectedEmployee?.status}
                  onChangeText={(text) =>
                    selectedEmployee && setSelectedEmployee({ ...selectedEmployee, status: text })
                  }
                  placeholder="Enter status (Active/Inactive)"
                  style={styles.input}
                  className="text-black"
                /> */}
                <DropDownPicker
                  open={statusOpen}
                  value={selectedEmployee?.status}
                  items={statusDrop}
                  setOpen={setStatusOpen}
                  setValue={(callback) => {
                    const newValue = callback(selectedEmployee?.status);
                    if (selectedEmployee) {
                      setSelectedEmployee({ ...selectedEmployee, status: newValue });
                    }
                  }}
                />

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                  <Pressable onPress={() => setShowEditModal(false)} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText} className="text-black">
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      handleUpdateEmployee(selectedEmployee);
                      setSelectedEmployee(null);
                      setShowEditModal(false);
                    }}
                    style={styles.addButton}
                    disabled={loading}>
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text numberOfLines={1} style={styles.addButtonText} className="text-black">
                        Update Employee
                      </Text>
                      // <Text style={styles.addButtonText}>Back to Employee</Text>
                    )}
                  </Pressable>
                </View>
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Delete Modal */}
      {!readOnly && showDeleteModal && (
        <Modal
          visible={showDeleteModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDeleteModal(false)}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
            onPress={() => setShowDeleteModal(false)}>
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                  Delete Employee
                </Text>
                <Text style={{ marginBottom: 12 }}>
                  Are you sure you want to delete {selectedEmployee?.name}?
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Pressable
                    onPress={() => setShowDeleteModal(false)}
                    style={{
                      marginRight: 12,
                      borderWidth: 1,
                      borderColor: '#FF6B6B',
                      padding: 10,
                      borderRadius: 6,
                    }}>
                    <Text style={{ color: 'black', backgroundColor: 'red' }}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleDeleteEmployee}
                    style={{ backgroundColor: '#FF6B6B', padding: 10, borderRadius: 6 }}>
                    <Text style={{ color: 'white' }}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
      {/* {!readOnly && (
        <Pressable
          onPress={() => setShowAddModal(true)}
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
      )} */}

      {/* ID Card Modal */}
      {/* {selectedEmployee && (
        <Modal
          visible={!!selectedEmployee && !showEditModal}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedEmployee(null)}>
          <View style={styles.modalContainer}>
            <View>
              <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                <View style={styles.idCardPage}>
                  <EmployeeIdCard employee={selectedEmployee} />
                </View>
                <View style={styles.idCardPage}>
                  <EmployeeIdCardDetail employee={selectedEmployee} />
                </View>
              </ScrollView>
              <TouchableOpacity onPress={() => setSelectedEmployee(null)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'white',
    color: 'black', // ✅ Makes input text black
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  radioButtonSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E3F2FD',
  },
  radioButtonSelectedFemale: {
    borderColor: '#be25ab',
    backgroundColor: '#E3F2FD',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 30,
  },
  cancelButton: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
    color: 'black',
    backgroundColor: 'grey',
  },
  cancelButtonText: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 40,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  idCardPage: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    color: 'white',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
});

export default EmployeesScreen;
