import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { Api } from 'class/HandleApi';
import { configFile } from 'config';

interface Employee {
  id: number;
  name: string;
  employee_id: string;
  contact_mobile_no: string;
  aadhaar_number?: string;
  account_number?: string;
  ifsc?: string;
  profile_image?: string;
  is_aadhaar_verified: boolean;
  is_bank_verified: boolean;
  [key: string]: any;
}

interface Props {
  visible: boolean;
  employee: Employee;
  onClose: () => void;
  onVerified: () => void;
  verifiedData: React.Dispatch<React.SetStateAction<any>>;
}

const EmployeeVerification: React.FC<Props> = ({
  visible,
  employee,
  onClose,
  onVerified,
  verifiedData,
}) => {
  console.log(employee, '///Emp');
  const [localEmp, setLocalEmp] = useState<Employee>({ ...employee });
  const [aadharClientId, setAadharClientId] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalEmp({ ...employee });
    setAadharClientId('');
    setOtp('');
  }, [employee]);

  const handleVerifyAadhaar = async () => {
    try {
      setLoading(true);
      const url = configFile.api.superAdmin.app.aadhar.verify;
      const res = await Api.handleApi({
        url,
        type: 'POST',
        payload: { aadhaarNumber: localEmp.aadhaar_number },
      });
      if (res.status === 200) {
        setAadharClientId(res.data.client_id);
        Alert.alert('OTP Sent', 'Enter the OTP to continue.');
      } else {
        Alert.alert('Error', res.data.message || 'Aadhaar verification failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
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
        setLocalEmp((prev) => ({
          ...prev,
          name: data.full_name,
          is_aadhaar_verified: true,
          profile_image: data.profile_image,
        }));
        Alert.alert('Success', 'Aadhaar verified successfully.');
      } else {
        Alert.alert('Error', res.data.message || 'OTP verification failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBank = async () => {
    try {
      setLoading(true);
      const url = configFile.api.superAdmin.app.bank.verify;
      const res = await Api.handleApi({
        url,
        type: 'POST',
        payload: {
          id_number: localEmp.account_number,
          ifsc: localEmp.ifsc,
        },
      });

      if (res.status === 200) {
        setLocalEmp((prev) => ({
          ...prev,
          name_at_bank: res.data.bankDetails.nameAtBank,
          bank_name: res.data.bankDetails.bankName,
          is_bank_verified: true,
        }));
        Alert.alert('Success', 'Bank verification successful.');
      } else {
        Alert.alert('Error', res.data.message || 'Bank verification failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = () => {
    if (localEmp.is_aadhaar_verified && localEmp.is_bank_verified) {
      verifiedData(localEmp);

      onVerified();
    } else {
      Alert.alert('Incomplete', 'Please complete both verifications.');
    }
  };

  const renderContent = () => {
    if (!localEmp.is_aadhaar_verified) {
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder="Aadhaar Number"
            placeholderTextColor="#888"
            keyboardType="numeric"
            maxLength={12}
            value={localEmp.aadhaar_number}
            onChangeText={(text) => setLocalEmp({ ...localEmp, aadhaar_number: text })}
            editable={!loading}
          />
          {aadharClientId ? (
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
              editable={!loading}
            />
          ) : null}
          <TouchableOpacity
            style={styles.button}
            onPress={aadharClientId ? handleVerifyOtp : handleVerifyAadhaar}>
            <Text style={styles.buttonText}>
              {aadharClientId ? 'Verify OTP' : 'Verify Aadhaar'}
            </Text>
          </TouchableOpacity>
        </>
      );
    } else if (!localEmp.is_bank_verified) {
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder="Account Number"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={localEmp.account_number}
            onChangeText={(text) => setLocalEmp({ ...localEmp, account_number: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="IFSC Code"
            placeholderTextColor="#888"
            value={localEmp.ifsc}
            onChangeText={(text) => setLocalEmp({ ...localEmp, ifsc: text.toUpperCase() })}
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyBank}>
            <Text style={styles.buttonText}>Verify Bank</Text>
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <>
          {localEmp.profile_image && (
            <Image
              source={{ uri: `data:image/jpeg;base64,${localEmp.profile_image}` }}
              style={styles.image}
            />
          )}
          <Text style={styles.label}>Name: {localEmp.name}</Text>
          <Text style={styles.label}>Employee ID: {localEmp.employee_id}</Text>
          <Text style={styles.label}>Mobile: {localEmp.contact_mobile_no}</Text>
          <Text style={styles.label}>Bank: {localEmp.bank_name}</Text>
          <Text style={styles.label}>Aadhaar Verified ✅</Text>
          <Text style={styles.label}>Bank Verified ✅</Text>

          <TouchableOpacity style={[styles.button, styles.submit]} onPress={handleFinalSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>Employee Verification</Text>
          <ScrollView>{renderContent()}</ScrollView>
          {loading && <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 10 }} />}
          <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EmployeeVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    color: 'black',
  },
  label: {
    fontSize: 14,
    marginVertical: 4,
    color: 'black',
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submit: {
    backgroundColor: '#4CAF50',
  },
  cancel: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginVertical: 10,
  },
});
