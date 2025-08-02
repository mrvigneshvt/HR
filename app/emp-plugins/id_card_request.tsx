import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { NavRouter } from 'class/Router';
import { Api } from 'class/HandleApi';
import { configFile } from 'config';

const IDCardRequest = () => {
  const { company, empId, role } = useLocalSearchParams();

  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (empId) setEmployeeId(String(empId));
    NavRouter.BackHandler({ role, empId, company });
  }, []);

  const handleSubmit = async () => {
    if (!employeeId || !employeeName || !designation || !department) {
      Alert.alert('All fields are required');
      return;
    }

    const payload = {
      employee_id: employeeId,
      employee_name: employeeName,
      designation,
      department,
      status: 'Pending',
      accessory_requested: 'ID CARD',
    };

    console.log;

    setLoading(true);
    try {
      const response = await Api.handleApi({
        url: configFile.api.superAdmin.idcard,
        // 'https://sdce.lyzooapp.co.in:31313/api/idcard/',   //toChange
        type: 'POST',
        payload,
      });

      if (response.status === 201) {
        Alert.alert('Requested!', response.data.message || 'ID Card Requested Successfully!');
        router.replace({ pathname: '/(admin)/home', params: { role, company, empId } });
        return;
      }

      Alert.alert('Request Failed :(', response.data.message || 'Something went wrong.');
    } catch (err) {
      Alert.alert('Error', 'Something went wrong while submitting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          title: 'Dashboard',
          headerStyle: {
            backgroundColor: configFile.colorGreen,
            elevation: 10,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
          },
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>ID Card Request Form</Text>

        <Text style={styles.label}>Employee ID</Text>
        <TextInput
          placeholderTextColor={'gray'}
          style={styles.input}
          placeholder="Enter Employee ID"
          value={employeeId}
          onChangeText={(text: string) => setEmployeeId(text.toUpperCase())}
        />

        <Text style={styles.label}>Employee Name</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor={'gray'}
          placeholder="Enter Employee Name"
          value={employeeName}
          onChangeText={setEmployeeName}
        />

        <Text style={styles.label}>Designation</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor={'gray'}
          placeholder="Enter Designation"
          value={designation}
          onChangeText={setDesignation}
        />

        <Text style={styles.label}>Department</Text>
        <TextInput
          placeholderTextColor={'gray'}
          style={styles.input}
          placeholder="Enter Department"
          value={department}
          onChangeText={setDepartment}
        />

        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: 'gray' }]}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Request'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default IDCardRequest;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 15,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: 'black',
  },
  button: {
    backgroundColor: configFile.colorGreen,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
