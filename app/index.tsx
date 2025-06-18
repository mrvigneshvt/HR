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
import { configFile } from 'config';
import PopupMessage from 'components/Popup';
import LoadingScreen from 'components/LoadingScreen';
import { Flow } from 'class/HandleRoleFlow';
import { Api } from 'class/HandleApi';
import * as SecureStore from 'expo-secure-store';
// import * as SecureStore from 'expo-secure-store';
const logo = require('../assets/logo.jpg');

export type PopUpTypes =
  | 'Internal Server Error Try Again Later'
  | 'EmployeeId not Found'
  | 'Invalid Employee ID'
  | 'Incorrect OTP'
  | 'Too Late Try Again From First !';

export default function LoginPage() {
  const setDashboard = DashMemory((state) => state.setDashboard);

  const router = useRouter();
  const [empId, setEmpId] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [popup, setPopUp] = useState(false);
  const [popMsg, setPopMsg] = useState('');
  const [popUpMessages] = useState({
    notFound: 'EmployeeId not Found',
    invalid: 'Invalid Employee ID',
  });
  const [isOtp, setIsOtp] = useState(false);
  const [otp, setOtp] = useState<string>('');
  const [otpHash, setOtpHash] = useState<string>('');
  const [otpToNumber, setOtpToNumber] = useState('');
  const [apiData, setApiData] = useState(null);

  const triggerPopup = (data: PopUpTypes) => {
    setPopMsg(data);
    setPopUp(true);
    setTimeout(() => setPopUp(false), 2000); // hide manually if needed
  };

  function handleEmpId(text: string) {
    console.log(empId);
    setEmpId(() => text.toLocaleUpperCase());
  }

  function handleOtp(text: string) {
    setOtp(text);
  }

  async function verifyOtp() {
    await Api.verifyOtpV1({
      otp,
      empId,
      triggerPopup,
      setApiLoading,
      setIsOtp,
    });
  }

  // const [password, setPassword] = useState('');
  const handleLogin = async () => {
    if (empId.length < 4) {
      triggerPopup('Invalid Employee ID');
      return;
    }
    try {
      console.log('going udner handleAuth');
      await Api.handleAuthV1({
        empId,
        setApiLoading,
        triggerPopup,
        setIsOtp,
        setOtpHash,
        setOtpToNumber,
        setApiData,
      });
    } catch (error) {
      console.log('error in loginPage:', error);
    }
  };

  // const checkToken = async () => {
  //   const token = await SecureStore.getItemAsync('STOKEN');
  //   console.log(token, 'tokennnnnn');
  //   if (!token) {
  //     return;
  //   }
  //   let isVerified = await Api.verifyToken(token);
  //   console.log(isVerified);

  //   if (!isVerified) {
  //     //await SecureStore.deleteItemAsync('STOKEN');
  //     return;
  //   }

  //   console.log('IsVerifiedddd', isVerified);
  //   router.replace({
  //     pathname: '/ApiContex/fetchNparse',
  //     params: {
  //       data: JSON.stringify(isVerified.data),
  //     },
  //   });
  // };

  // useEffect(() => {
  //   checkToken();
  // }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     router.replace({
  //       // pathname: '/(tabs)/dashboard',
  //       pathname: '/(admin)/home',
  //       params: {
  //         data: JSON.stringify({
  //           __v: 0,
  //           _id: '6836d2fb5412bdf9177fc475',
  //           createdAt: '2025-05-28T09:10:19.743Z',
  //           department: 'Engineering',
  //           designation: 'Junior',
  //           dob: '1970-01-01T00:00:37.272Z',
  //           doj: '1970-01-01T00:00:45.800Z',
  //           email: 'ajay@gmail.com',
  //           empId: 'EMP105',
  //           gender: 'Male',
  //           guardianName: 'Selva',
  //           inAppRole: 'Employee',
  //           mobile: '8348346334',
  //           name: 'Ajay',
  //           role: 'Supervisor',
  //           status: 'Active',
  //           updatedAt: '2025-05-28T09:10:19.743Z',
  //         }),
  //       },
  //     });
  //   }, 50);
  // }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Pressable onPress={Keyboard.dismiss} style={styles.container}>
        {popup && <PopupMessage text={popMsg} duration={3000} />}

        <Pressable onPress={Keyboard.dismiss} style={styles.formContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={logo}
              style={{ width: 80, height: 80, borderRadius: 8 }}
              contentFit="contain"
            />
          </View>
          <Text style={styles.title}>{!isOtp ? 'Employeee Login' : `Verify OTP`}</Text>

          <TextInput
            style={styles.input}
            keyboardType={!isOtp ? 'default' : 'number-pad'}
            placeholder={!isOtp ? 'Employee ID' : `OTP Sent to ${otpToNumber}`}
            placeholderTextColor="#888"
            value={!isOtp ? empId.toLocaleUpperCase() : otp}
            onChangeText={!isOtp ? handleEmpId : handleOtp}
          />

          <Pressable
            style={styles.loginButton}
            className={`${apiLoading ? 'bg-black' : `bg-[${configFile.colorGreen}]`}`}
            disabled={apiLoading ? true : false}
            onPress={() => {
              if (!isOtp) {
                handleLogin();
              } else {
                verifyOtp();
              }
            }}>
            <Text style={styles.buttonText}>{!isOtp ? 'Log In' : 'Verify Otp'}</Text>
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
