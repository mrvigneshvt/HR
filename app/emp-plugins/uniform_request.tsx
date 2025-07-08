import {
  View,
  Text,
  TextInput,
  Switch,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Pressable,
  BackHandler,
  Alert,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import ProfileStack from 'Stacks/HeaderStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';
import { configFile } from '../../config';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEmployeeStore } from 'Memory/Employee';
import { format } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { Api } from 'class/HandleApi';

import PopupMessage from 'plugins/popupz';
import { NavRouter } from 'class/Router';

// ... same imports

const Uniform = () => {
  const { empId, role } = useLocalSearchParams<{ empId: string; role: string }>();
  const employee = useEmployeeStore((state) => state.employee);
  const isMale = employee?.gender?.toLowerCase() === 'male';

  const accessories = useMemo(
    () =>
      isMale
        ? ['belt', 'lanyard', 'whistle', 'idCard', 'cap', 'flab']
        : ['belt', 'lanyard', 'whistle', 'idCard', 'cap'],
    [isMale]
  );

  const initialState = {
    empId,
    role,
    ...(isMale ? { shirtSize: '', pantSize: '' } : { chudiSize: '' }),
    shoeSize: '',
    ...Object.fromEntries(accessories.map((key) => [key, false])),
  };

  const [state, setState] = useState(initialState);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    // const onBackPress = () => {
    //   router.replace({ pathname: '/(tabs)/dashboard/', params: { role, empId } });
    //   return true;
    // };
    // BackHandler.addEventListener('hardwareBackPress', onBackPress);
    // return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    NavRouter.BackHandler({ empId, role });
  }, []);

  const toggleSwitch = (key: keyof typeof state) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInput = (key: keyof typeof state, value: string, limit: number = 2) => {
    if (/^\d*$/.test(value) && value.length <= limit) {
      setState((prev) => ({ ...prev, [key]: value }));
    }
  };

  const isFormChanged = () => {
    const sizes = isMale
      ? [state.shirtSize, state.pantSize, state.shoeSize]
      : [state.chudiSize, state.shoeSize];
    const isAnySizeEntered = sizes.some((size) => !!size && parseInt(size) > 0);

    const isAnyAccessoryChecked = accessories.some((key) => state[key as keyof typeof state]);

    return isAnySizeEntered || isAnyAccessoryChecked;
  };

  const postUniformRequest = async () => {
    if (!isFormChanged()) {
      Alert.alert(
        'Error',
        'Please fill at least one size or select any accessory before submitting.'
      );
      return;
    }

    try {
      const accessoriesSelected = accessories.filter((key) => state[key as keyof typeof state]);

      const payload = {
        empId: String(empId),
        name: employee?.name || '',
        designation: employee?.designation || 'Not Assigned',
        site: employee?.site || 'Not Assigned',
        location: 'Not Assigned',
        gender: isMale ? 'Male' : 'Female',
        status: 'Active',
        requestedDate: format(new Date(), 'yyyy/MM/dd'),
        shirtSize: isMale ? parseInt(state.shirtSize || '0') : 0,
        pantSize: isMale ? parseInt(state.pantSize || '0') : 0,
        shoeSize: isMale ? parseInt(state.shoeSize || '0') : 0,
        chuditharSize: !isMale ? parseInt(state.chudiSize || '0') : 0,
        femaleShoeSize: !isMale ? parseInt(state.shoeSize || '0') : 0,
        accessories: isMale ? accessoriesSelected : [],
        femaleAccessories: !isMale ? accessoriesSelected : [],
      };

      const response = await Api.postUniReq(payload);

      if (response.status) {
        Alert.alert('Uniform request submitted successfully!');
        setTimeout(() => {
          router.replace({ pathname: '/(tabs)/dashboard/', params: { empId, role } });
        }, 2000);
      } else {
        setPopupMessage(response?.message || 'Something went wrong');
      }

      setPopupVisible(true);
    } catch (error) {
      console.error('Uniform request failed:', error);
      setPopupMessage('Failed to submit uniform request.');
      setPopupVisible(true);
    }
  };

  return (
    <>
      <ProfileStack Uniform={true} />
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, padding: scale(16), paddingBottom: 40 }}>
            {['empId', 'role'].map((field) => (
              <View key={field} style={{ marginBottom: verticalScale(12) }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{field.toUpperCase()}</Text>
                <Text style={styles.readOnly}>{state[field as keyof typeof state]}</Text>
              </View>
            ))}

            {/* Size Inputs */}
            {isMale ? (
              <>
                <CustomInput
                  label="Shirt Size"
                  value={state.shirtSize}
                  onChangeText={(text) => handleInput('shirtSize', text)}
                />
                <CustomInput
                  label="Pant Size"
                  value={state.pantSize}
                  onChangeText={(text) => handleInput('pantSize', text)}
                />
              </>
            ) : (
              <CustomInput
                label="Chudi Size"
                value={state.chudiSize}
                onChangeText={(text) => handleInput('chudiSize', text)}
              />
            )}
            <CustomInput
              label="Shoe Size"
              value={state.shoeSize}
              onChangeText={(text) =>
                /^\d*$/.test(text) && parseInt(text || '0') <= 20
                  ? setState((prev) => ({ ...prev, shoeSize: text }))
                  : null
              }
            />

            {/* Accessories */}
            {accessories.map((key) => (
              <View
                key={key}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: verticalScale(12),
                }}>
                <Text style={{ fontWeight: 'bold' }}>{key.toUpperCase()}</Text>
                <Switch
                  value={state[key as keyof typeof state] as boolean}
                  onValueChange={() => toggleSwitch(key as keyof typeof state)}
                />
              </View>
            ))}

            <Pressable
              onPress={postUniformRequest}
              className="flex-row items-center justify-center self-center rounded-xl p-4"
              style={{ backgroundColor: configFile.colorGreen }}>
              <Text className="font-semibold text-white">Request Uniform</Text>
              <FontAwesome
                name={isMale ? 'male' : 'female'}
                size={24}
                color="white"
                style={{ marginLeft: 8 }}
              />
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {popupVisible && (
        <PopupMessage message={popupMessage} onClose={() => setPopupVisible(false)} />
      )}
    </>
  );
};

const CustomInput = ({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}) => (
  <View style={{ marginBottom: verticalScale(12) }}>
    <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{label}</Text>
    <TextInput
      keyboardType="number-pad"
      maxLength={2}
      value={value}
      onChangeText={onChangeText}
      style={styles.input}
    />
  </View>
);

const styles = {
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: Platform.OS === 'android' ? 8 : 10,
    borderRadius: 8,
    marginTop: 4,
  },
  readOnly: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
};

export default Uniform;
