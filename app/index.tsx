import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Link, Stack, useRouter } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import '../global.css';
import { Dashboard, DashMemory, DashMemoryType } from 'Memory/DashMem';
import { customPlugins } from 'plugins/plug';

const logo = require('../assets/logo.jpg');

export default function LoginPage() {
  const setDashboard = DashMemory((state) => state.setDashboard);

  const router = useRouter();
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = () => {};

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Company 1', value: 'COM1' },
    { label: 'Company 2', value: 'COM2' },
  ]);

  const [open1, setOpen1] = useState(false);
  const [value1, setValue1] = useState(null);
  const [items1, setItems1] = useState([
    { label: 'Engineer', value: 'ROL1' },
    { label: 'SuperVisor', value: 'ROL2' },
    { label: 'TL', value: 'ROL3' },
  ]);

  useEffect(() => {
    const time = setTimeout(() => {
      router.push({ pathname: '/dashboard/attendance' });
    }, 10);

    return () => clearTimeout(time);
  }, []);

  function handlelogin(employee: 'emp' | 'exe') {
    const employeeData = customPlugins.getExampleDatas(employee);
    if (employee === 'emp') {
      setDashboard(employeeData);
    } else {
      console.log(employeeData);
      setDashboard(employeeData);
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Pressable onPress={Keyboard.dismiss} style={styles.container}>
        <Pressable onPress={Keyboard.dismiss} style={styles.formContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={logo}
              style={{ width: 80, height: 80, borderRadius: 8 }}
              contentFit="contain"
            />
          </View>
          <Text style={styles.title}>Employee Login</Text>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Employee ID"
            placeholderTextColor="#888"
            value={empId}
            onChangeText={setEmpId}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.dropdownContainer}>
            <DropDownPicker
              placeholder="Select Company"
              disabled={!password || !empId}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownMenu}
            />
          </View>

          {value && (
            <View style={[styles.dropdownContainer, { zIndex: 999 }]}>
              <DropDownPicker
                placeholder="Select Role"
                disabled={!password || !empId}
                open={open1}
                value={value1}
                items={items1}
                setOpen={setOpen1}
                setValue={setValue1}
                setItems={setItems1}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownMenu}
              />
            </View>
          )}

          <Pressable
            style={styles.loginButton}
            onPress={() => {
              handleLogin();
              console.log('Logging in with:', empId, password);
            }}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>

          <Pressable onPress={() => router.replace('/profile')}>
            <Text style={styles.linkText}>Create an Account</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              try {
                handlelogin('emp');
                router.replace('/dashboard');
              } catch (error) {
                console.log('error in navigating..::', error);
              }
            }}>
            <View style={styles.dashboardButton}>
              <Text style={styles.buttonText}>Dashboard Secion (Employee)</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              handlelogin('exe');

              router.push('/dashboard');
            }}>
            <View style={[styles.dashboardButton, { backgroundColor: '#dc2626' }]}>
              <Text style={styles.buttonText}>Dashboard Secion (Executive)</Text>
            </View>
          </Pressable>
        </Pressable>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
    maxWidth: 384,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.8,
    elevation: 5,
  },
  logoContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#238c58',
  },
  input: {
    marginBottom: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#238c58',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: 'black',
  },
  dropdownContainer: {
    zIndex: 1000,
    marginBottom: 16,
  },
  dropdown: {
    borderColor: '#238c58',
    height: 50,
  },
  dropdownMenu: {
    borderColor: '#238c58',
    maxHeight: 150,
  },
  loginButton: {
    marginBottom: 16,
    borderRadius: 4,
    backgroundColor: '#238c58',
    paddingVertical: 8,
  },
  dashboardButton: {
    marginTop: 40,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 4,
    backgroundColor: '#16a34a',
    padding: 8,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '600',
    color: 'white',
  },
  linkText: {
    textAlign: 'center',
    color: '#238c58',
    textDecorationLine: 'underline',
  },
});
