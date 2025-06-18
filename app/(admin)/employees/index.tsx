import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Modal, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Alert, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { configFile } from '../../../config';
import SearchBar from '../../../components/search';
import axios from 'axios';

const BASE_URL = 'https://sdce.lyzooapp.co.in:31313/api';

interface Employee {
  employee_id: string;
  name: string;
  gender: 'Male' | 'Female';
  father_spouse_name: string;
  dob: string | null;
  age: number | null;
  aadhaar_number: string;
  guardian_name: string;
  reference_id: string;
  mobile_verified: boolean;
  is_aadhaar_verified: boolean;
  profile_image: string | null;
  address_country: string;
  address_state: string;
  address_district: string;
  address_po: string;
  address_street: string;
  address_house: string;
  address_landmark: string;
  address_zip: string;
  contact_email: string;
  contact_mobile_no: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  communication_address: string;
  marital_status: string;
  status: string;
  account_number: string;
  ifsc: string;
  bank_name: string;
  bank_code: string;
  bank_branch: string;
  bank_city: string;
  bank_district: string;
  bank_state: string;
  bank_centre: string;
  iso_code: string;
  swift_code: string;
  micr_code: string;
  upi_enabled: boolean;
  rtgs_enabled: boolean;
  neft_enabled: boolean;
  imps_enabled: boolean;
  bank_contact: string;
  bank_address: string;
  is_bank_verified: boolean;
  date_of_joining: string | null;
  role: string;
  department: string;
  designation: string;
  branch: string;
  reporting: string;
  uan_number: string;
  esi_number: string;
  esi_card: string | null;
  pan_number: string;
  voter_id: string;
  driving_license: string;
  pan_card: string | null;
  voter_id_card: string | null;
  driving_license_card: string | null;
  joining_date: string;
  bank_account_number: string;
  bank_ifsc_code: string;
  bank_account_holder_name: string;
  bank_account_type: string;
  bank_account_status: string;
  bank_account_balance: string;
  bank_account_currency: string;
  bank_account_opening_date: string;
  bank_account_closing_date: string;
  bank_account_remarks: string;
}

interface FormErrors {
  employee_id?: string;
  name?: string;
  gender?: string;
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
  role?: string;
  department?: string;
  designation?: string;
  branch?: string;
  reporting?: string;
  aadhaar_number?: string;
  pan_number?: string;
  voter_id?: string;
  driving_license?: string;
  bank_account_number?: string;
  bank_ifsc_code?: string;
  bank_account_holder_name?: string;
}

const initialEmployeeState: Employee = {
  employee_id: '',
  name: '',
  gender: 'Male',
  father_spouse_name: 'Not Provided',
  dob: null,
  age: null,
  aadhaar_number: '',
  guardian_name: '',
  reference_id: '',
  mobile_verified: false,
  is_aadhaar_verified: false,
  profile_image: null,
  address_country: '',
  address_state: '',
  address_district: '',
  address_po: '',
  address_street: '',
  address_house: '',
  address_landmark: '',
  address_zip: '',
  contact_email: '',
  contact_mobile_no: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  communication_address: '',
  marital_status: 'Not Provided',
  status: 'Active',
  account_number: '',
  ifsc: '',
  bank_name: '',
  bank_code: '',
  bank_branch: '',
  bank_city: '',
  bank_district: '',
  bank_state: '',
  bank_centre: '',
  iso_code: '',
  swift_code: '',
  micr_code: '',
  upi_enabled: false,
  rtgs_enabled: false,
  neft_enabled: false,
  imps_enabled: false,
  bank_contact: '',
  bank_address: '',
  is_bank_verified: false,
  date_of_joining: null,
  role: 'Executive',
  department: 'Not Assigned',
  designation: 'Operation Executive',
  branch: 'Chennai',
  reporting: 'Nithish',
  uan_number: '',
  esi_number: '',
  esi_card: null,
  pan_number: 'Not Provided',
  voter_id: 'Not Provided',
  driving_license: 'Not Provided',
  pan_card: null,
  voter_id_card: null,
  driving_license_card: null,
  joining_date: '',
  bank_account_number: '',
  bank_ifsc_code: '',
  bank_account_holder_name: '',
  bank_account_type: '',
  bank_account_status: '',
  bank_account_balance: '',
  bank_account_currency: '',
  bank_account_opening_date: '',
  bank_account_closing_date: '',
  bank_account_remarks: '',
};

const EmployeesScreen = () => {
  // Add this function to log API details
  const logApiDetails = (method: string, url: string, data?: any) => {
    console.log(`API Call Details:
      Method: ${method}
      URL: ${url}
      Data: ${JSON.stringify(data, null, 2)}
    `);
  };

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

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      console.log('Fetching employees...');
      
      const response = await axios.get(`${BASE_URL}/employees`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log('Fetch Response:', response.data);
      
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

  useEffect(() => {
    setFilteredList(
      employeeList.filter(emp =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, employeeList]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Basic Information Validation
    if (!newEmployee.employee_id?.trim()) {
      newErrors.employee_id = 'Employee ID is required';
    } else if (!/^[A-Z0-9]{3,10}$/.test(newEmployee.employee_id)) {
      newErrors.employee_id = 'Employee ID must be 3-10 characters (letters and numbers only)';
    }

    if (!newEmployee.name?.trim()) {
      newErrors.name = 'Name is required';
    } else if (newEmployee.name.length < 2 || newEmployee.name.length > 50) {
      newErrors.name = 'Name must be between 2 and 50 characters';
    }

    if (!newEmployee.gender) {
      newErrors.gender = 'Gender is required';
    }

    // Contact Information Validation
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

    if (!newEmployee.emergency_contact_name?.trim()) {
      newErrors.emergency_contact_name = 'Emergency contact name is required';
    }

    if (!newEmployee.emergency_contact_phone?.trim()) {
      newErrors.emergency_contact_phone = 'Emergency contact phone is required';
    } else if (!/^[6-9]\d{9}$/.test(newEmployee.emergency_contact_phone)) {
      newErrors.emergency_contact_phone = 'Emergency contact must be 10 digits starting with 6-9';
    }

    // Address Validation
    if (!newEmployee.address_country?.trim()) {
      newErrors.address_country = 'Country is required';
    }

    if (!newEmployee.address_state?.trim()) {
      newErrors.address_state = 'State is required';
    }

    if (!newEmployee.address_district?.trim()) {
      newErrors.address_district = 'District is required';
    }

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
    // } else if (!/^[1-9][0-9]{5}$/.test(newEmployee.address_zip)) {
    //   newErrors.address_zip = 'ZIP code must be 6 digits';
    // }

    // Employment Information Validation
    if (!newEmployee.role?.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!newEmployee.department?.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!newEmployee.designation?.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!newEmployee.branch?.trim()) {
      newErrors.branch = 'Branch is required';
    }

    if (!newEmployee.reporting?.trim()) {
      newErrors.reporting = 'Reporting manager is required';
    }

    // Document Validation
    if (!newEmployee.aadhaar_number?.trim()) {
      newErrors.aadhaar_number = 'Aadhaar number is required';
    } else if (!/^\d{12}$/.test(newEmployee.aadhaar_number)) {
      newErrors.aadhaar_number = 'Aadhaar number must be 12 digits';
    }

    // Bank Information Validation (only if bank name is provided)
    // if (newEmployee.bank_name?.trim()) {
    //   if (!newEmployee.bank_account_number?.trim()) {
    //     newErrors.bank_account_number = 'Bank account number is required when bank name is provided';
    //   } else if (!/^\d{9,18}$/.test(newEmployee.bank_account_number)) {
    //     newErrors.bank_account_number = 'Bank account number must be 9-18 digits';
    //   }

    //   if (!newEmployee.bank_ifsc_code?.trim()) {
    //     newErrors.bank_ifsc_code = 'IFSC code is required when bank name is provided';
    //   } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(newEmployee.bank_ifsc_code)) {
    //     newErrors.bank_ifsc_code = 'Invalid IFSC code format';
    //   }

    //   if (!newEmployee.bank_account_holder_name?.trim()) {
    //     newErrors.bank_account_holder_name = 'Account holder name is required when bank name is provided';
    //   }
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEmployee = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare the employee data with default values
      const employeeData = {
        ...newEmployee,
        joining_date: new Date().toISOString().split('T')[0],
        status: 'Active',
        mobile_verified: false,
        is_aadhaar_verified: false,
        is_bank_verified: false,
        upi_enabled: false,
        rtgs_enabled: false,
        neft_enabled: false,
        imps_enabled: false,
        father_spouse_name: newEmployee.father_spouse_name || 'Not Provided',
        guardian_name: newEmployee.guardian_name || 'Not Provided',
        reference_id: newEmployee.reference_id || 'Not Provided',
        communication_address: newEmployee.communication_address || 'Not Provided',
        marital_status: newEmployee.marital_status || 'Not Provided',
        uan_number: newEmployee.uan_number || 'Not Provided',
        esi_number: newEmployee.esi_number || 'Not Provided',
        bank_account_type: newEmployee.bank_account_type || 'Savings',
        bank_account_status: newEmployee.bank_account_status || 'Active',
        bank_account_currency: newEmployee.bank_account_currency || 'INR'
      };

      console.log(employeeData,"employeeData")
      const response = await axios.post(`${BASE_URL}/employees`, employeeData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Response:', response.data);

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
      console.error('Add Employee Error:', error);
      
      let errorMessage = 'Failed to add employee. Please try again.';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'API endpoint not found. Please check the server configuration.';
        } else if (error.response.status === 409) {
          const conflicts = [];
          if (error.response.data.aadhaar_exists) {
            conflicts.push('Aadhaar Number');
          }
          if (error.response.data.mobile_exists) {
            conflicts.push('Mobile Number');
          }
          errorMessage = `The following details already exist: ${conflicts.join(', ')}`;
        } else {
          errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/employees/${selectedEmployee.employee_id}`);
      setEmployeeList(employeeList.filter(emp => emp.employee_id !== selectedEmployee.employee_id));
      Alert.alert('Success', 'Employee Delete successfully');
      setShowDeleteModal(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete employee');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      setLoading(true);

      console.log('Sending request to:', `${BASE_URL}/employees/${selectedEmployee.employee_id}`);
      console.log('Request data:', selectedEmployee);

      const response = await axios.put(
        `${BASE_URL}/employees/${selectedEmployee.employee_id}`,
        selectedEmployee,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Response:', response.data);

      if (response.data) {
        Alert.alert('Success', 'Employee updated successfully');
        setShowEditModal(false);
        fetchEmployees();
      } else {
        throw new Error(response.data.message || 'Failed to update employee');
      }
    } catch (error: any) {
      console.error('Update Employee Error:', error);
      console.error('Error Response:', error.response?.data);
      console.error('Error Status:', error.response?.status);
      console.error('Error Config:', error.config);
      
      let errorMessage = 'Failed to update employee. Please try again.';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'API endpoint not found. Please check the server configuration.';
        } else if (error.response.status === 409) {
          const conflicts = [];
          if (error.response.data.aadhaar_exists) {
            conflicts.push('Aadhaar Number');
          }
          if (error.response.data.mobile_exists) {
            conflicts.push('Mobile Number');
          }
          errorMessage = `The following details already exist: ${conflicts.join(', ')}`;
        } else {
          errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      }
      
      Alert.alert('Error', errorMessage);
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
      }}
    >
      <View>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
        <Text style={{ color: 'gray' }}>ID: {item.employee_id}</Text>
        <Text style={{ color: 'gray' }}>Role: {item.role}</Text>
        <Text style={{ color: 'gray' }}>Department: {item.department}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable onPress={() => handleEditEmployee(item)}>
          <MaterialIcons name="edit" size={20} color="#4A90E2" />
        </Pressable>
        <Pressable onPress={() => { setSelectedEmployee(item); setShowDeleteModal(true); }}>
          <MaterialIcons name="delete" size={20} color="#FF6B6B" />
        </Pressable>
      </View>
    </View>
  );

  const renderAddModal = () => (
    <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => setShowAddModal(false)}>
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
        onPress={() => setShowAddModal(false)}
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <ScrollView style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Add Employee</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Basic Information */}
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <Text>Employee ID *</Text>
            <TextInput
              value={newEmployee.employee_id}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, employee_id: text });
                if (errors.employee_id) setErrors({ ...errors, employee_id: undefined });
              }}
              placeholder="Enter employee ID"
              style={[styles.input, errors.employee_id && styles.inputError]}
            />
            {errors.employee_id && <Text style={styles.errorText}>{errors.employee_id}</Text>}

            <Text>Name *</Text>
            <TextInput
              value={newEmployee.name}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, name: text });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Enter name"
              style={[styles.input, errors.name && styles.inputError]}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <Text>Gender *</Text>
            <View style={styles.radioGroup}>
              <Pressable
                style={[styles.radioButton, newEmployee.gender === 'Male' && styles.radioButtonSelected]}
                onPress={() => {
                  setNewEmployee({ ...newEmployee, gender: 'Male' });
                  if (errors.gender) setErrors({ ...errors, gender: undefined });
                }}
              >
                <Text>Male</Text>
              </Pressable>
              <Pressable
                style={[styles.radioButton, newEmployee.gender === 'Female' && styles.radioButtonSelected]}
                onPress={() => {
                  setNewEmployee({ ...newEmployee, gender: 'Female' });
                  if (errors.gender) setErrors({ ...errors, gender: undefined });
                }}
              >
                <Text>Female</Text>
              </Pressable>
            </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

            <Text>Father/Spouse Name</Text>
            <TextInput
              value={newEmployee.father_spouse_name}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, father_spouse_name: text })}
              placeholder="Enter father/spouse name"
              style={styles.input}
            />

            <Text>Date of Birth</Text>
            <TextInput
              value={newEmployee.dob || ''}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, dob: text })}
              placeholder="YYYY-MM-DD"
              style={styles.input}
            />

            <Text>Age</Text>
            <TextInput
              value={newEmployee.age?.toString() || ''}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, age: parseInt(text) || null })}
              placeholder="Enter age"
              keyboardType="numeric"
              style={styles.input}
            />

            {/* Contact Information */}
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <Text>Email *</Text>
            <TextInput
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

            <Text>Mobile Number *</Text>
            <TextInput
              value={newEmployee.contact_mobile_no}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, contact_mobile_no: text });
                if (errors.contact_mobile_no) setErrors({ ...errors, contact_mobile_no: undefined });
              }}
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              style={[styles.input, errors.contact_mobile_no && styles.inputError]}
            />
            {errors.contact_mobile_no && <Text style={styles.errorText}>{errors.contact_mobile_no}</Text>}

            <Text>Emergency Contact Name *</Text>
            <TextInput
              value={newEmployee.emergency_contact_name}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, emergency_contact_name: text });
                if (errors.emergency_contact_name) setErrors({ ...errors, emergency_contact_name: undefined });
              }}
              placeholder="Enter emergency contact name"
              style={[styles.input, errors.emergency_contact_name && styles.inputError]}
            />
            {errors.emergency_contact_name && <Text style={styles.errorText}>{errors.emergency_contact_name}</Text>}

            <Text>Emergency Contact Phone *</Text>
            <TextInput
              value={newEmployee.emergency_contact_phone}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, emergency_contact_phone: text });
                if (errors.emergency_contact_phone) setErrors({ ...errors, emergency_contact_phone: undefined });
              }}
              placeholder="Enter emergency contact"
              keyboardType="phone-pad"
              maxLength={10}
              style={[styles.input, errors.emergency_contact_phone && styles.inputError]}
            />
            {errors.emergency_contact_phone && <Text style={styles.errorText}>{errors.emergency_contact_phone}</Text>}

            {/* Address Information */}
            <Text style={styles.sectionTitle}>Address Information</Text>
            <Text>Country</Text>
            <TextInput
              value={newEmployee.address_country}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_country: text })}
              placeholder="Enter country"
              style={styles.input}
            />

            <Text>State</Text>
            <TextInput
              value={newEmployee.address_state}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_state: text })}
              placeholder="Enter state"
              style={styles.input}
            />

            <Text>District</Text>
            <TextInput
              value={newEmployee.address_district}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_district: text })}
              placeholder="Enter district"
              style={styles.input}
            />

            <Text>Post Office</Text>
            <TextInput
              value={newEmployee.address_po}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_po: text })}
              placeholder="Enter post office"
              style={styles.input}
            />

            <Text>Street</Text>
            <TextInput
              value={newEmployee.address_street}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_street: text })}
              placeholder="Enter street"
              style={styles.input}
            />

            <Text>House Number</Text>
            <TextInput
              value={newEmployee.address_house}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_house: text })}
              placeholder="Enter house number"
              style={styles.input}
            />

            <Text>Landmark</Text>
            <TextInput
              value={newEmployee.address_landmark}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_landmark: text })}
              placeholder="Enter landmark"
              style={styles.input}
            />

            <Text>ZIP Code</Text>
            <TextInput
              value={newEmployee.address_zip}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_zip: text })}
              placeholder="Enter ZIP code"
              keyboardType="numeric"
              style={styles.input}
            />

            {/* Employment Information */}
            <Text style={styles.sectionTitle}>Employment Information</Text>
            <Text>Role *</Text>
            <TextInput
              value={newEmployee.role}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, role: text });
                if (errors.role) setErrors({ ...errors, role: undefined });
              }}
              placeholder="Enter role"
              style={[styles.input, errors.role && styles.inputError]}
            />
            {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

            <Text>Department *</Text>
            <TextInput
              value={newEmployee.department}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, department: text });
                if (errors.department) setErrors({ ...errors, department: undefined });
              }}
              placeholder="Enter department"
              style={[styles.input, errors.department && styles.inputError]}
            />
            {errors.department && <Text style={styles.errorText}>{errors.department}</Text>}

            <Text>Designation *</Text>
            <TextInput
              value={newEmployee.designation}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, designation: text });
                if (errors.designation) setErrors({ ...errors, designation: undefined });
              }}
              placeholder="Enter designation"
              style={[styles.input, errors.designation && styles.inputError]}
            />
            {errors.designation && <Text style={styles.errorText}>{errors.designation}</Text>}

            <Text>Branch *</Text>
            <TextInput
              value={newEmployee.branch}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, branch: text });
                if (errors.branch) setErrors({ ...errors, branch: undefined });
              }}
              placeholder="Enter branch"
              style={[styles.input, errors.branch && styles.inputError]}
            />
            {errors.branch && <Text style={styles.errorText}>{errors.branch}</Text>}

            <Text>Reporting Manager *</Text>
            <TextInput
              value={newEmployee.reporting}
              onChangeText={(text) => {
                setNewEmployee({ ...newEmployee, reporting: text });
                if (errors.reporting) setErrors({ ...errors, reporting: undefined });
              }}
              placeholder="Enter reporting manager"
              style={[styles.input, errors.reporting && styles.inputError]}
            />
            {errors.reporting && <Text style={styles.errorText}>{errors.reporting}</Text>}

            {/* Document Information */}
            <Text style={styles.sectionTitle}>Document Information</Text>
            <Text>Aadhaar Number *</Text>
            <TextInput
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

            <Text>PAN Number</Text>
            <TextInput
              value={newEmployee.pan_number}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, pan_number: text })}
              placeholder="Enter PAN number"
              style={styles.input}
            />

            <Text>Voter ID</Text>
            <TextInput
              value={newEmployee.voter_id}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, voter_id: text })}
              placeholder="Enter voter ID"
              style={styles.input}
            />

            <Text>Driving License</Text>
            <TextInput
              value={newEmployee.driving_license}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, driving_license: text })}
              placeholder="Enter driving license"
              style={styles.input}
            />

            {/* Bank Information */}
            <Text style={styles.sectionTitle}>Bank Information</Text>
            <Text>Bank Name</Text>
            <TextInput
              value={newEmployee.bank_name}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, bank_name: text })}
              placeholder="Enter bank name"
              style={styles.input}
            />

            <Text>Account Number</Text>
            <TextInput
              value={newEmployee.bank_account_number}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, bank_account_number: text })}
              placeholder="Enter account number"
              keyboardType="numeric"
              style={styles.input}
            />

            <Text>IFSC Code</Text>
            <TextInput
              value={newEmployee.bank_ifsc_code}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, bank_ifsc_code: text })}
              placeholder="Enter IFSC code"
              style={styles.input}
            />

            <Text>Account Holder Name</Text>
            <TextInput
              value={newEmployee.bank_account_holder_name}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, bank_account_holder_name: text })}
              placeholder="Enter account holder name"
              style={styles.input}
            />

            {/* Add Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleAddEmployee}
              disabled={loading}
            >
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

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Employees',
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={configFile.colorGreen} />
        </View>
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.employee_id}
          renderItem={renderEmployeeCard}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}

      {renderAddModal()}

      {/* Edit Modal */}
      <Modal visible={showEditModal} transparent animationType="slide" onRequestClose={() => setShowEditModal(false)}>
        <TouchableOpacity activeOpacity={1} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setShowEditModal(false)}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <ScrollView style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Edit Employee</Text>

              {/* Basic Information */}
              <Text style={styles.sectionTitle}>Basic Information</Text>
              <Text>Employee ID</Text>
              <TextInput
                value={selectedEmployee?.employee_id}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, employee_id: text })}
                placeholder="Enter employee ID"
                style={styles.input}
              />

              <Text>Name</Text>
              <TextInput
                value={selectedEmployee?.name}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, name: text })}
                placeholder="Enter name"
                style={styles.input}
              />

              <Text>Gender</Text>
              <View style={styles.radioGroup}>
                <Pressable
                  style={[styles.radioButton, selectedEmployee?.gender === 'Male' && styles.radioButtonSelected]}
                  onPress={() => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, gender: 'Male' })}
                >
                  <Text>Male</Text>
                </Pressable>
                <Pressable
                  style={[styles.radioButton, selectedEmployee?.gender === 'Female' && styles.radioButtonSelected]}
                  onPress={() => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, gender: 'Female' })}
                >
                  <Text>Female</Text>
                </Pressable>
              </View>

              {/* Contact Information */}
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <Text>Email</Text>
              <TextInput
                value={selectedEmployee?.contact_email}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, contact_email: text })}
                placeholder="Enter email"
                keyboardType="email-address"
                style={styles.input}
              />

              <Text>Mobile Number</Text>
              <TextInput
                value={selectedEmployee?.contact_mobile_no}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, contact_mobile_no: text })}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                style={styles.input}
              />

              <Text>Emergency Contact Name</Text>
              <TextInput
                value={selectedEmployee?.emergency_contact_name}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, emergency_contact_name: text })}
                placeholder="Enter emergency contact name"
                style={styles.input}
              />

              <Text>Emergency Contact Phone</Text>
              <TextInput
                value={selectedEmployee?.emergency_contact_phone}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, emergency_contact_phone: text })}
                placeholder="Enter emergency contact"
                keyboardType="phone-pad"
                maxLength={10}
                style={styles.input}
              />

              {/* Address Information */}
              <Text style={styles.sectionTitle}>Address Information</Text>
              <Text>Country</Text>
              <TextInput
                value={selectedEmployee?.address_country}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, address_country: text })}
                placeholder="Enter country"
                style={styles.input}
              />

              <Text>State</Text>
              <TextInput
                value={selectedEmployee?.address_state}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, address_state: text })}
                placeholder="Enter state"
                style={styles.input}
              />

              <Text>District</Text>
              <TextInput
                value={selectedEmployee?.address_district}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, address_district: text })}
                placeholder="Enter district"
                style={styles.input}
              />

              <Text>Post Office</Text>
              <TextInput
                value={selectedEmployee?.address_po}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, address_po: text })}
                placeholder="Enter post office"
                style={styles.input}
              />

              <Text>Street</Text>
              <TextInput
                value={selectedEmployee?.address_street}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, address_street: text })}
                placeholder="Enter street"
                style={styles.input}
              />

              <Text>House Number</Text>
              <TextInput
                value={selectedEmployee?.address_house}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, address_house: text })}
                placeholder="Enter house number"
                style={styles.input}
              />

              <Text>Landmark</Text>
              <TextInput
                value={selectedEmployee?.address_landmark}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, address_landmark: text })}
                placeholder="Enter landmark"
                style={styles.input}
              />

              <Text>ZIP Code</Text>
              <TextInput
                value={selectedEmployee?.address_zip}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, address_zip: text })}
                placeholder="Enter ZIP code"
                keyboardType="numeric"
                style={styles.input}
              />

              {/* Employment Information */}
              <Text style={styles.sectionTitle}>Employment Information</Text>
              <Text>Role</Text>
              <TextInput
                value={selectedEmployee?.role}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, role: text })}
                placeholder="Enter role"
                style={styles.input}
              />

              <Text>Department</Text>
              <TextInput
                value={selectedEmployee?.department}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, department: text })}
                placeholder="Enter department"
                style={styles.input}
              />

              <Text>Designation</Text>
              <TextInput
                value={selectedEmployee?.designation}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, designation: text })}
                placeholder="Enter designation"
                style={styles.input}
              />

              <Text>Branch</Text>
              <TextInput
                value={selectedEmployee?.branch}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, branch: text })}
                placeholder="Enter branch"
                style={styles.input}
              />

              <Text>Reporting Manager</Text>
              <TextInput
                value={selectedEmployee?.reporting}
                onChangeText={(text) => selectedEmployee && setSelectedEmployee({ ...selectedEmployee, reporting: text })}
                placeholder="Enter reporting manager"
                style={styles.input}
              />

              <View style={styles.buttonContainer}>
                <Pressable
                  onPress={() => setShowEditModal(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleUpdateEmployee}
                  style={styles.addButton}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.addButtonText}>Save</Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Delete Modal */}
      <Modal visible={showDeleteModal} transparent animationType="slide" onRequestClose={() => setShowDeleteModal(false)}>
        <TouchableOpacity activeOpacity={1} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setShowDeleteModal(false)}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Delete Employee</Text>
              <Text style={{ marginBottom: 12 }}>Are you sure you want to delete {selectedEmployee?.name}?</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Pressable onPress={() => setShowDeleteModal(false)} style={{ marginRight: 12, borderWidth: 1, borderColor: '#FF6B6B', padding: 10, borderRadius: 6 }}>
                  <Text style={{ color: '#FF6B6B' }}>Cancel</Text>
                </Pressable>
                <Pressable onPress={handleDeleteEmployee} style={{ backgroundColor: '#FF6B6B', padding: 10, borderRadius: 6 }}>
                  <Text style={{ color: 'white' }}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginVertical: 30,
    

  },
  cancelButton: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  cancelButtonText: {
    color: '#666',
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
});

export default EmployeesScreen;
