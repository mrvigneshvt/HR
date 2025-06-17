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
      const response = await axios.get(`${BASE_URL}/employees`);
      setEmployeeList(response.data);
      setFilteredList(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch employees');
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
    if (!newEmployee.employee_id.trim()) {
      newErrors.employee_id = 'Employee ID is required';
    } else if (newEmployee.employee_id.length < 3) {
      newErrors.employee_id = 'Employee ID must be at least 3 characters';
    }

    if (!newEmployee.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (newEmployee.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!newEmployee.gender) {
      newErrors.gender = 'Gender is required';
    }

    // Contact Information Validation
    if (!newEmployee.contact_email.trim()) {
      newErrors.contact_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newEmployee.contact_email)) {
      newErrors.contact_email = 'Invalid email format';
    }

    if (!newEmployee.contact_mobile_no.trim()) {
      newErrors.contact_mobile_no = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(newEmployee.contact_mobile_no)) {
      newErrors.contact_mobile_no = 'Mobile number must be 10 digits';
    }

    if (!newEmployee.emergency_contact_name.trim()) {
      newErrors.emergency_contact_name = 'Emergency contact name is required';
    }

    if (!newEmployee.emergency_contact_phone.trim()) {
      newErrors.emergency_contact_phone = 'Emergency contact phone is required';
    } else if (!/^[0-9]{10}$/.test(newEmployee.emergency_contact_phone)) {
      newErrors.emergency_contact_phone = 'Emergency contact must be 10 digits';
    }

    // Address Validation
    if (!newEmployee.address_country.trim()) {
      newErrors.address_country = 'Country is required';
    }

    if (!newEmployee.address_state.trim()) {
      newErrors.address_state = 'State is required';
    }

    if (!newEmployee.address_district.trim()) {
      newErrors.address_district = 'District is required';
    }

    if (!newEmployee.address_po.trim()) {
      newErrors.address_po = 'Post Office is required';
    }

    if (!newEmployee.address_street.trim()) {
      newErrors.address_street = 'Street is required';
    }

    if (!newEmployee.address_house.trim()) {
      newErrors.address_house = 'House number is required';
    }

    if (!newEmployee.address_landmark.trim()) {
      newErrors.address_landmark = 'Landmark is required';
    }

    if (!newEmployee.address_zip.trim()) {
      newErrors.address_zip = 'ZIP code is required';
    } else if (!/^[0-9]{6}$/.test(newEmployee.address_zip)) {
      newErrors.address_zip = 'ZIP code must be 6 digits';
    }

    // Employment Information Validation
    if (!newEmployee.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!newEmployee.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!newEmployee.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!newEmployee.branch.trim()) {
      newErrors.branch = 'Branch is required';
    }

    if (!newEmployee.reporting.trim()) {
      newErrors.reporting = 'Reporting manager is required';
    }

    // Document Validation
    if (!newEmployee.aadhaar_number.trim()) {
      newErrors.aadhaar_number = 'Aadhaar number is required';
    } else if (!/^[0-9]{12}$/.test(newEmployee.aadhaar_number)) {
      newErrors.aadhaar_number = 'Aadhaar number must be 12 digits';
    }

    if (!newEmployee.pan_number.trim()) {
      newErrors.pan_number = 'PAN number is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(newEmployee.pan_number)) {
      newErrors.pan_number = 'Invalid PAN number format';
    }

    if (!newEmployee.voter_id.trim()) {
      newErrors.voter_id = 'Voter ID is required';
    }

    if (!newEmployee.driving_license.trim()) {
      newErrors.driving_license = 'Driving license is required';
    }

    // Bank Information Validation
    if (newEmployee.bank_name.trim()) {
      if (!newEmployee.bank_account_number.trim()) {
        newErrors.bank_account_number = 'Bank account number is required when bank name is provided';
      } else if (!/^[0-9]{9,18}$/.test(newEmployee.bank_account_number)) {
        newErrors.bank_account_number = 'Invalid bank account number';
      }

      if (!newEmployee.bank_ifsc_code.trim()) {
        newErrors.bank_ifsc_code = 'IFSC code is required when bank name is provided';
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(newEmployee.bank_ifsc_code)) {
        newErrors.bank_ifsc_code = 'Invalid IFSC code format';
      }

      if (!newEmployee.bank_account_holder_name.trim()) {
        newErrors.bank_account_holder_name = 'Account holder name is required when bank name is provided';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEmployee = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/employees`, newEmployee);
      Alert.alert('Success', response.data.message);
      setNewEmployee(initialEmployeeState);
      setShowAddModal(false);
      fetchEmployees();
    } catch (error) {
      Alert.alert('Error', 'Failed to add employee');
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
      setShowDeleteModal(false);
      setSelectedEmployee(null);
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
      const response = await axios.put(`${BASE_URL}/employees/${selectedEmployee.employee_id}`, selectedEmployee);
      Alert.alert('Success', 'Employee updated successfully');
      setShowEditModal(false);
      fetchEmployees();
    } catch (error) {
      Alert.alert('Error', 'Failed to update employee');
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
          <ScrollView style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%',  }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Add Employees</Text>

            {/* Basic Information */}
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <Text>Employee ID</Text>
            <TextInput
              value={newEmployee.employee_id}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, employee_id: text })}
              placeholder="Enter employee ID"
              style={[styles.input, errors.employee_id && styles.inputError]}
            />
            {errors.employee_id && <Text style={styles.errorText}>{errors.employee_id}</Text>}

            <Text>Name</Text>
            <TextInput
              value={newEmployee.name}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, name: text })}
              placeholder="Enter name"
              style={[styles.input, errors.name && styles.inputError]}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <Text>Gender</Text>
            <View style={styles.radioGroup}>
              <Pressable
                style={[styles.radioButton, newEmployee.gender === 'Male' && styles.radioButtonSelected]}
                onPress={() => setNewEmployee({ ...newEmployee, gender: 'Male' })}
              >
                <Text>Male</Text>
              </Pressable>
              <Pressable
                style={[styles.radioButton, newEmployee.gender === 'Female' && styles.radioButtonSelected]}
                onPress={() => setNewEmployee({ ...newEmployee, gender: 'Female' })}
              >
                <Text>Female</Text>
              </Pressable>
            </View>

            {/* Contact Information */}
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <Text>Email</Text>
            <TextInput
              value={newEmployee.contact_email}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, contact_email: text })}
              placeholder="Enter email"
              keyboardType="email-address"
              style={[styles.input, errors.contact_email && styles.inputError]}
            />
            {errors.contact_email && <Text style={styles.errorText}>{errors.contact_email}</Text>}

            <Text>Mobile Number</Text>
            <TextInput
              value={newEmployee.contact_mobile_no}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, contact_mobile_no: text })}
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              style={[styles.input, errors.contact_mobile_no && styles.inputError]}
            />
            {errors.contact_mobile_no && <Text style={styles.errorText}>{errors.contact_mobile_no}</Text>}

            <Text>Emergency Contact Name</Text>
            <TextInput
              value={newEmployee.emergency_contact_name}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, emergency_contact_name: text })}
              placeholder="Enter emergency contact name"
              style={[styles.input, errors.emergency_contact_name && styles.inputError]}
            />
            {errors.emergency_contact_name && <Text style={styles.errorText}>{errors.emergency_contact_name}</Text>}

            <Text>Emergency Contact Phone</Text>
            <TextInput
              value={newEmployee.emergency_contact_phone}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, emergency_contact_phone: text })}
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
              style={[styles.input, errors.address_country && styles.inputError]}
            />
            {errors.address_country && <Text style={styles.errorText}>{errors.address_country}</Text>}

            <Text>State</Text>
            <TextInput
              value={newEmployee.address_state}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_state: text })}
              placeholder="Enter state"
              style={[styles.input, errors.address_state && styles.inputError]}
            />
            {errors.address_state && <Text style={styles.errorText}>{errors.address_state}</Text>}

            <Text>District</Text>
            <TextInput
              value={newEmployee.address_district}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_district: text })}
              placeholder="Enter district"
              style={[styles.input, errors.address_district && styles.inputError]}
            />
            {errors.address_district && <Text style={styles.errorText}>{errors.address_district}</Text>}

            <Text>Post Office</Text>
            <TextInput
              value={newEmployee.address_po}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_po: text })}
              placeholder="Enter post office"
              style={[styles.input, errors.address_po && styles.inputError]}
            />
            {errors.address_po && <Text style={styles.errorText}>{errors.address_po}</Text>}

            <Text>Street</Text>
            <TextInput
              value={newEmployee.address_street}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_street: text })}
              placeholder="Enter street"
              style={[styles.input, errors.address_street && styles.inputError]}
            />
            {errors.address_street && <Text style={styles.errorText}>{errors.address_street}</Text>}

            <Text>House Number</Text>
            <TextInput
              value={newEmployee.address_house}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_house: text })}
              placeholder="Enter house number"
              style={[styles.input, errors.address_house && styles.inputError]}
            />
            {errors.address_house && <Text style={styles.errorText}>{errors.address_house}</Text>}

            <Text>Landmark</Text>
            <TextInput
              value={newEmployee.address_landmark}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_landmark: text })}
              placeholder="Enter landmark"
              style={[styles.input, errors.address_landmark && styles.inputError]}
            />
            {errors.address_landmark && <Text style={styles.errorText}>{errors.address_landmark}</Text>}

            <Text>ZIP Code</Text>
            <TextInput
              value={newEmployee.address_zip}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, address_zip: text })}
              placeholder="Enter ZIP code"
              keyboardType="numeric"
              style={[styles.input, errors.address_zip && styles.inputError]}
            />
            {errors.address_zip && <Text style={styles.errorText}>{errors.address_zip}</Text>}

            {/* Employment Information */}
            <Text style={styles.sectionTitle}>Employment Information</Text>
            <Text>Role</Text>
            <TextInput
              value={newEmployee.role}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, role: text })}
              placeholder="Enter role"
              style={[styles.input, errors.role && styles.inputError]}
            />
            {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

            <Text>Department</Text>
            <TextInput
              value={newEmployee.department}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, department: text })}
              placeholder="Enter department"
              style={[styles.input, errors.department && styles.inputError]}
            />
            {errors.department && <Text style={styles.errorText}>{errors.department}</Text>}

            <Text>Designation</Text>
            <TextInput
              value={newEmployee.designation}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, designation: text })}
              placeholder="Enter designation"
              style={[styles.input, errors.designation && styles.inputError]}
            />
            {errors.designation && <Text style={styles.errorText}>{errors.designation}</Text>}

            <Text>Branch</Text>
            <TextInput
              value={newEmployee.branch}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, branch: text })}
              placeholder="Enter branch"
              style={[styles.input, errors.branch && styles.inputError]}
            />
            {errors.branch && <Text style={styles.errorText}>{errors.branch}</Text>}

            <Text>Reporting Manager</Text>
            <TextInput
              value={newEmployee.reporting}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, reporting: text })}
              placeholder="Enter reporting manager"
              style={[styles.input, errors.reporting && styles.inputError]}
            />
            {errors.reporting && <Text style={styles.errorText}>{errors.reporting}</Text>}

            <View style={styles.buttonContainer}>
              <Pressable
                onPress={() => setShowAddModal(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleAddEmployee}
                style={styles.addButton}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.addButtonText}>Add</Text>
                )}
              </Pressable>
            </View>
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
});

export default EmployeesScreen;
