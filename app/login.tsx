import {
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  StyleSheet,
  useColorScheme,
  Animated,
  Easing,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';

import { Api } from 'class/HandleApi';
import { State } from 'class/State';
import { NavRouter } from 'class/Router';
import { configFile } from 'config';
import { Themez } from 'class/Theme';
import PopupMessage from 'components/Popup';
import logo from '../assets/logomainsdce.png';

export type PopUpTypes =
  | 'Internal Server Error Try Again Later'
  | 'EmployeeId not Found'
  | 'Invalid Employee ID'
  | 'Incorrect OTP'
  | 'Too Late Try Again From First !';

const LoginPage = () => {
  const theme = useColorScheme() as 'dark' | 'light';
  const router = useRouter();

  const [empId, setEmpId] = useState('');
  const [otp, setOtp] = useState('');
  const [otpHash, setOtpHash] = useState('');
  const [otpToNumber, setOtpToNumber] = useState('');
  const [isOtp, setIsOtp] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [popup, setPopup] = useState(false);
  const [popMsg, setPopMsg] = useState('');

  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    State.deleteToken();
    NavRouter.stayBack();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const shadowGlow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(118,185,0,0.2)', 'rgba(118,185,0,0.8)'],
  });

  const triggerPopup = (message: PopUpTypes) => {
    setPopMsg(message);
    setPopup(true);
    setTimeout(() => setPopup(false), 2000);
  };

  const handleLogin = async () => {
    if (empId.length < 4) return triggerPopup('Invalid Employee ID');

    try {
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
      console.error('Login Error:', error);
    }
  };

  const handleVerifyOtp = async () => {
    await Api.verifyOtpV1({
      otp,
      empId,
      triggerPopup,
      setApiLoading,
      setIsOtp,
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <Pressable
        onPress={Keyboard.dismiss}
        style={[styles.container, { backgroundColor: Themez.color({ theme, for: 'main-bg' }) }]}>
        {popup && <PopupMessage text={popMsg} duration={3000} />}

        <Animated.View
          style={[
            styles.formContainer,
            {
              backgroundColor: Themez.color({ theme, for: 'card-bg' }),
              shadowColor: shadowGlow,
            },
          ]}>
          <View style={styles.logoContainer}>
            <Image
              source={logo}
              style={{ width: 80, height: 80, borderRadius: 8 }}
              contentFit="contain"
            />
          </View>

          <Text style={[styles.title, { color: Themez.color({ theme, for: 'main-text' }) }]}>
            {!isOtp ? 'Employee Login' : `Verify OTP`}
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                borderColor: configFile.colorGreen,
                backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
                color: theme === 'dark' ? '#fff' : '#000',
              },
            ]}
            keyboardType={!isOtp ? 'default' : 'number-pad'}
            placeholder={!isOtp ? 'Employee ID' : `OTP Sent to ${otpToNumber}`}
            placeholderTextColor="#888"
            value={!isOtp ? empId.toUpperCase() : otp}
            onChangeText={!isOtp ? setEmpId : setOtp}
          />

          <Pressable
            style={[
              styles.loginButton,
              { backgroundColor: apiLoading ? 'black' : configFile.colorGreen },
            ]}
            disabled={apiLoading}
            onPress={() => {
              if (!isOtp) handleLogin();
              else handleVerifyOtp();
            }}>
            <Text style={styles.buttonText}>{!isOtp ? 'Log In' : 'Verify OTP'}</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  formContainer: {
    width: '100%',
    maxWidth: 384,
    padding: 24,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  loginButton: {
    borderRadius: 6,
    paddingVertical: 10,
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});
