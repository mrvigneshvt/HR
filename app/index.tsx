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

const logo = require('../assets/logo.jpg');

export default function LoginPage() {
  const setDashboard = DashMemory((state) => state.setDashboard);

  const router = useRouter();
  const [empId, setEmpId] = useState('');
  const [apiRes, setApiRes] = useState(false);
  const [apiData, setApiData]: any = useState({});
  const [popup, setPopUp] = useState(false);
  const [popupdata, setPopUpData] = useState('');

  const triggerPopup = () => {
    setPopUp(true);
    setTimeout(() => setPopUp(false), 2000); // hide manually if needed
  };

  function handleEmpId(text: string) {
    setEmpId(() => text.toLocaleUpperCase());
  }

  // const [password, setPassword] = useState('');
  const handleLogin = async () => {
    const url = configFile.api.fetchEmpData(empId);
    try {
      let getData: Record<string, any> | any = await fetch(url, { method: 'GET' });

      if (getData.ok) {
        getData = await getData.json();

        setApiRes(true);
        setApiData(getData.data);

        console.log(apiData, '////');

        if (apiData.inAppRole === 'employee') {
          if (apiData.status === 'Active') {
            router.replace({
              pathname: '/dashboard',
              params: {
                status: 'Active',
              },
            });
          }
          router.replace({
            pathname: '/inactive',
            params: {
              status: 'Active',
            },
          });
        }
      }
      if (getData.status === 404) {
        triggerPopup();
      }

      console.log(apiData);
    } catch (error) {
      console.log('error in loginPage:', error);
    }
  };

  useEffect(() => {
    // if(apiData && apiData.data)
  }, [apiData]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Pressable onPress={Keyboard.dismiss} style={styles.container}>
        {popup && <PopupMessage text="Employee ID not Found" duration={3000} />}

        <Pressable onPress={Keyboard.dismiss} style={styles.formContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={logo}
              style={{ width: 80, height: 80, borderRadius: 8 }}
              contentFit="contain"
            />
          </View>
          <Text style={styles.title}>Employeee Login</Text>

          <TextInput
            style={styles.input}
            keyboardType="default"
            placeholder="Employee ID"
            placeholderTextColor="#888"
            value={empId.toLocaleUpperCase()}
            onChangeText={handleEmpId}
          />

          <Pressable
            style={styles.loginButton}
            onPress={() => {
              handleLogin();
            }}>
            <Text style={styles.buttonText}>Logein</Text>
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
