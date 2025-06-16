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
  aadhaar_number?: string;
  contact_mobile_no?: string;
  emergency_contact_phone?: string;
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
    
    if (!newEmployee.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!newEmployee.employee_id.trim()) {
      newErrors.employee_id = 'Employee ID is required';
    }
    if (!newEmployee.aadhaar_number.trim()) {
      newErrors.aadhaar_number = 'Aadhaar number is required';
    }
    if (!newEmployee.contact_mobile_no.trim()) {
      newErrors.contact_mobile_no = 'Mobile number is required';
    }
    if (!newEmployee.emergency_contact_phone.trim()) {
      newErrors.emergency_contact_phone = 'Emergency contact is required';
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
          <ScrollView style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Add Employssssee</Text>

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

            <Text>Aadhaar Number</Text>
            <TextInput
              value={newEmployee.aadhaar_number}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, aadhaar_number: text })}
              placeholder="Enter Aadhaar number"
              keyboardType="numeric"
              maxLength={12}
              style={[styles.input, errors.aadhaar_number && styles.inputError]}
            />
            {errors.aadhaar_number && <Text style={styles.errorText}>{errors.aadhaar_number}</Text>}

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

            <Text>Emergency Contact</Text>
            <TextInput
              value={newEmployee.emergency_contact_phone}
              onChangeText={(text) => setNewEmployee({ ...newEmployee, emergency_contact_phone: text })}
              placeholder="Enter emergency contact"
              keyboardType="phone-pad"
              maxLength={10}
              style={[styles.input, errors.emergency_contact_phone && styles.inputError]}
            />
            {errors.emergency_contact_phone && <Text style={styles.errorText}>{errors.emergency_contact_phone}</Text>}

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
            <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Edit Employee</Text>

              <TextInput
                placeholder="Name"
                value={selectedEmployee?.name}
                onChangeText={(text) => setSelectedEmployee({ ...selectedEmployee, name: text })}
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 12 }}
              />
              <TextInput
                placeholder="Location"
                value={selectedEmployee?.branch}
                onChangeText={(text) => setSelectedEmployee({ ...selectedEmployee, branch: text })}
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 }}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                <Pressable onPress={() => setShowEditModal(false)} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, marginRight: 8, borderWidth: 1, borderColor: '#4A90E2' }}>
                  <Text style={{ color: '#4A90E2' }}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleUpdateEmployee}
                  style={{ backgroundColor: '#4A90E2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 }}
                >
                  <Text style={{ color: 'white' }}>Save</Text>
                </Pressable>
              </View>
            </View>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EmployeesScreen;
