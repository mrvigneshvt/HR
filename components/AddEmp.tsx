import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Employee } from 'app/(admin)/employees';
import { configFile } from 'config';
import { Api } from 'class/HandleApi';
import { format } from 'date-fns';

interface AddEmpProps {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: () => void;
}

const initialState: Employee = {
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
  date_of_joining: format(new Date(), 'yyyy-MM-dd'),
  role: 'Employee',
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

const AddEmp: React.FC<AddEmpProps> = ({ showAddModal, setShowAddModal, onSave }) => {
  const [newEmployee, setNewEmployee] = useState<Employee>({ ...initialState });
  const [aadharClientId, setAadharClientId] = useState('');
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<'SafeQuad' | 'SDCE'>('SafeQuad');

  const prefixMap = {
    SafeQuad: 'SQ',
    SDCE: 'SFM',
  };

  const handleChange = (key: keyof Employee, value: any) => {
    setNewEmployee((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setNewEmployee({ ...initialState });
    setAadharClientId('');
    setOtp('');
    setLoading(false);
    setSelectedCompany('SafeQuad');
    setShowAddModal(false);
  };

  const handleAadhaarVerification = async () => {
    try {
      setLoading(true);
      const url = configFile.api.superAdmin.app.aadhar.verify;
      const res = await Api.handleApi({
        url,
        type: 'POST',
        payload: { aadhaarNumber: newEmployee.aadhaar_number },
      });

      if (res.status === 200) {
        Alert.alert('Verify OTP', 'OTP has been sent to the linke d mobile number.');
        setAadharClientId(res.data.client_id);
      } else {
        Alert.alert('Error', res.data.message || 'Failed to initiate Aadhaar verification.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    try {
      setLoading(true);
      const url = configFile.api.superAdmin.app.aadhar.verifyOtp;
      const res = await Api.handleApi({
        url,
        type: 'POST',
        payload: { client_id: aadharClientId, otp },
      });

      if (res.status === 200 && res.data.employeeData) {
        const data = res.data.employeeData;
        setNewEmployee((prev) => ({
          ...prev,
          name: data.full_name,
          dob: data.dob,
          gender: data.gender === 'M' ? 'Male' : 'Female',
          address_country: data.address.country,
          address_state: data.address.state,
          address_district: data.address.dist,
          address_po: data.address.po,
          address_house: data.address.house,
          address_landmark: data.address.landmark,
          address_street: data.address.street,
          address_zip: data.zip,
          profile_image: data.profile_image,
          is_aadhaar_verified: true,
        }));
      } else {
        Alert.alert('Error', res.data.message || 'OTP verification failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBankVerification = async () => {
    try {
      setLoading(true);
      const url = configFile.api.superAdmin.app.bank.verify;
      const res = await Api.handleApi({
        url,
        type: 'POST',
        payload: {
          id_number: newEmployee.account_number,
          ifsc: newEmployee.ifsc,
        },
      });

      if (res.status === 200) {
        setNewEmployee((prev) => ({
          ...prev,
          name_at_bank: res.data.bankDetails.nameAtBank,
          bank_name: res.data.bankDetails.bankName,
        }));
        Alert.alert('Verified', 'Bank account has been verified.');
        handleChange('is_bank_verified', true);
      } else {
        Alert.alert('Error', res.data.message || 'Bank verification failed.');
      }
    } finally {
      setLoading(false);
    }
  };
  const validateAddEmployee = (item: Employee): boolean => {
    const missingFields: string[] = [];

    if (!item.contact_mobile_no || item.contact_mobile_no.length < 10) {
      missingFields.push('Invalid Mobile Number');
    }

    if (!item.employee_id || item.employee_id.length < 4) {
      missingFields.push('Employee ID (minimum 4 characters) Including Prefixs1');
    }

    if (missingFields.length > 0) {
      Alert.alert('Missing Fields', missingFields.join('\n\n'));
      return false;
    }

    return true;
  };

  const handleAddEmployee = async () => {
    try {
      if (!validateAddEmployee(newEmployee)) return;
      setLoading(true);
      console.log(newEmployee, '////payload');
      let payload = {
        ...newEmployee,
        profile_image: null,
      };
      const req = await Api.handleApi({
        url: configFile.api.superAdmin.employees.add(),
        type: 'POST',
        payload,
      });
      Alert.alert(req.status == 201 ? 'Success' : 'Failed', req.data.message);
      if (req.status == 201) {
        resetForm();
        onSave();
      }
    } catch {
      Alert.alert('Error', 'Failed to submit employee data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newEmployee.is_aadhaar_verified) {
      if (!aadharClientId) return await handleAadhaarVerification();
      if (otp) return await handleOtpVerification();
      return Alert.alert('Enter OTP', 'Please enter the OTP to continue.');
    }

    if (!newEmployee.is_bank_verified) {
      return await handleBankVerification();
    }

    return await handleAddEmployee();
  };

  const handleEmpIdChange = (val: string) => {
    const numericPart = val.replace(/\D/g, '');
    const prefix = prefixMap[selectedCompany];
    handleChange('employee_id', `${prefix}${numericPart}`);
  };

  const allVerified = newEmployee.is_aadhaar_verified && newEmployee.is_bank_verified;

  return (
    <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={resetForm}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title} className="text-black">
            Add Employee
          </Text>

          {newEmployee.profile_image ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${newEmployee.profile_image}` }}
              style={styles.profileImage}
            />
          ) : null}

          <ScrollView showsVerticalScrollIndicator={false}>
            {!newEmployee.is_aadhaar_verified ? (
              <>
                <TextInput
                  placeholder="Aadhaar Number"
                  placeholderTextColor="#888"
                  inputMode="numeric"
                  maxLength={12}
                  value={newEmployee.aadhaar_number}
                  onChangeText={(text) => handleChange('aadhaar_number', text)}
                  style={styles.input}
                  editable={!loading}
                />
                {aadharClientId && (
                  <TextInput
                    placeholder="OTP"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={otp}
                    onChangeText={setOtp}
                    style={styles.input}
                    editable={!loading}
                  />
                )}
              </>
            ) : !newEmployee.is_bank_verified ? (
              <>
                <TextInput
                  placeholder="Bank Account Number"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={newEmployee.account_number}
                  onChangeText={(text) => handleChange('account_number', text)}
                  style={styles.input}
                />
                <TextInput
                  placeholder="IFSC Code"
                  placeholderTextColor="#888"
                  value={newEmployee.ifsc}
                  onChangeText={(text) => handleChange('ifsc', text.toUpperCase())}
                  style={styles.input}
                />
              </>
            ) : (
              <>
                <View style={styles.pickerWrapper}>
                  <Picker
                    style={{ color: 'grey' }}
                    selectedValue={selectedCompany}
                    onValueChange={(value) => {
                      setSelectedCompany(value);
                      handleEmpIdChange(''); // Reset on switch
                    }}>
                    <Picker.Item label="SafeQuad" value="SafeQuad" />
                    <Picker.Item label="SDCE" value="SDCE" />
                  </Picker>
                </View>

                <TextInput
                  placeholder="Enter Employee ID"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={newEmployee.employee_id}
                  onChangeText={handleEmpIdChange}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Enter Employee Contact Number"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  maxLength={10}
                  value={newEmployee.contact_mobile_no}
                  onChangeText={(text) =>
                    setNewEmployee((prev) => ({ ...prev, contact_mobile_no: text }))
                  }
                  style={styles.input}
                />

                <View style={styles.pickerWrapper}>
                  <Picker
                    style={{ color: 'grey' }}
                    selectedValue={newEmployee.role}
                    onValueChange={(value) => handleChange('role', value)}>
                    <Picker.Item label="Employee" value="Employee" />
                    <Picker.Item label="Executive" value="Executive" />
                    <Picker.Item label="Manager" value="Manager" />
                  </Picker>
                </View>

                {Object.entries(newEmployee).map(([key, value]) =>
                  value && typeof value === 'string' && key !== 'profile_image' ? (
                    <View key={key} style={styles.fieldBlock}>
                      <Text style={styles.label}>{key.replace(/_/g, ' ')}</Text>
                      <TextInput
                        value={value}
                        editable={false}
                        style={[styles.input, styles.disabledInput]}
                      />
                    </View>
                  ) : null
                )}
              </>
            )}
          </ScrollView>

          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" style={{ marginVertical: 16 }} />
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.cancel]} onPress={resetForm}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.submit]} onPress={handleSubmit}>
                <Text style={styles.submitText}>
                  {!newEmployee.is_aadhaar_verified
                    ? aadharClientId
                      ? 'Verify OTP'
                      : 'Verify Aadhaar'
                    : !newEmployee.is_bank_verified
                      ? 'Verify Bank'
                      : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    color: 'black',
    marginBottom: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    color: 'black',
  },
  fieldBlock: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#444',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancel: {
    backgroundColor: '#ccc',
  },
  submit: {
    backgroundColor: '#4CAF50',
  },
  cancelText: {
    color: '#333',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddEmp;
