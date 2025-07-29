import {
  View,
  Text,
  TextInput,
  Switch,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Pressable,
  Alert,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import ProfileStack from 'Stacks/HeaderStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { format } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { Api } from 'class/HandleApi';
import PopupMessage from 'plugins/popupz';
import { NavRouter } from 'class/Router';

export interface UniformState {
  empId: string;
  name: string;
  designation: string;
  site: string;
  shirtSize?: string;
  pantSize?: string;
  chudiSize?: string;
  shoeSize?: string;
  belt?: boolean;
  lanyard?: boolean;
  whistle?: boolean;
  idCard?: boolean;
  cap?: boolean;
  flab?: boolean;
}

const Uniform = () => {
  const { empId: urlEmpId, role } = useLocalSearchParams<{ empId: string; role: string }>();
  const isEditable = true;

  const [manualGender, setManualGender] = useState<'male' | 'female'>('male');
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const accessories = useMemo(
    () => [
      'belt',
      'lanyard',
      'whistle',
      'idCard',
      'cap',
      ...(manualGender === 'male' ? ['flab'] : []),
    ],
    [manualGender]
  );

  const initialState = useMemo(() => {
    const base: UniformState = {
      empId: '',
      name: '',
      designation: '',
      site: '',
      shirtSize: '',
      pantSize: '',
      chudiSize: '',
      shoeSize: '',
    };
    accessories.forEach((item) => (base[item as keyof UniformState] = false));
    return base;
  }, [accessories]);

  const [state, setState] = useState<UniformState>(initialState);

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  useEffect(() => {
    NavRouter.BackHandler({ empId: urlEmpId, role });
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
    const sizes =
      manualGender === 'male'
        ? [state.shirtSize, state.pantSize, state.shoeSize]
        : [state.chudiSize, state.shoeSize];

    const isAnySizeEntered = sizes.some((size) => !!size && parseInt(size) > 0);
    const isAnyAccessoryChecked = accessories.some((key) => state[key as keyof typeof state]);
    return isAnySizeEntered || isAnyAccessoryChecked;
  };

  const postUniformRequest = async () => {
    if (!state.empId || !state.name || !state.designation || !state.site) {
      Alert.alert('Validation Error', 'Please fill in Employee ID, Name, Designation, and Site.');
      return;
    }

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
        empId: state.empId,
        name: state.name,
        designation: state.designation,
        site: state.site,
        location: 'chennai',
        gender: manualGender === 'male' ? 'Male' : 'Female',
        status: 'Pending',
        requestedDate: format(new Date(), 'yyyy-MM-dd'),
        shirtSize: manualGender === 'male' ? parseInt(state.shirtSize || '0') : 0,
        pantSize: manualGender === 'male' ? parseInt(state.pantSize || '0') : 0,
        shoeSize: manualGender === 'male' ? parseInt(state.shoeSize || '0') : 0,
        chuditharSize: manualGender === 'female' ? parseInt(state.chudiSize || '0') : 0,
        femaleShoeSize: manualGender === 'female' ? parseInt(state.shoeSize || '0') : 0,
        accessories: manualGender === 'male' ? accessoriesSelected : [],
        femaleAccessories: manualGender === 'female' ? accessoriesSelected : [],
      };

      const response = await Api.postUniReq(payload);
      if (response.status) {
        Alert.alert('Uniform request submitted successfully!');
        setTimeout(() => {
          NavRouter.backOrigin({ role, empId: urlEmpId });
          // router.replace({ pathname: '/(tabs)/dashboard/', params: { empId: urlEmpId, role } });
        }, 2000);
      } else {
        setPopupMessage(response?.message || 'Something went wrong');
        setPopupVisible(true);
      }
    } catch (error) {
      console.error('Uniform request failed:', error);
      setPopupMessage('Failed to submit uniform request.');
      setPopupVisible(true);
    }
  };

  return (
    <>
      <ProfileStack Uniform={true} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: scale(16), paddingBottom: 40 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: verticalScale(16),
              }}>
              <Text style={{ fontWeight: 'bold', color: 'black' }}>Gender</Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Pressable
                  onPress={() => setManualGender('male')}
                  style={{
                    borderColor: manualGender === 'male' ? 'black' : 'transparent',
                    borderWidth: 2,
                    borderRadius: 50,
                    padding: 10,
                    backgroundColor: '#07af9b',
                  }}>
                  <FontAwesome name="male" size={28} color="white" />
                </Pressable>
                <Pressable
                  onPress={() => setManualGender('female')}
                  style={{
                    borderColor: manualGender === 'female' ? 'black' : 'transparent',
                    borderWidth: 2,
                    borderRadius: 50,
                    padding: 10,
                    backgroundColor: 'hotpink',
                  }}>
                  <FontAwesome name="female" size={28} color="white" />
                </Pressable>
              </View>
            </View>

            {/* Editable Inputs */}
            <CustomInput
              label="Employee ID"
              value={state.empId}
              onChangeText={(text) => setState((prev) => ({ ...prev, empId: text }))}
              editable={true}
            />
            <CustomInput
              label="Name"
              value={state.name}
              onChangeText={(text) => setState((prev) => ({ ...prev, name: text }))}
              editable={true}
            />
            <CustomInput
              label="Designation"
              value={state.designation}
              onChangeText={(text) => setState((prev) => ({ ...prev, designation: text }))}
              editable={true}
            />
            <CustomInput
              label="Site"
              value={state.site}
              onChangeText={(text) => setState((prev) => ({ ...prev, site: text }))}
              editable={true}
            />

            {/* Gender Selector */}

            {manualGender === 'male' ? (
              <>
                <CustomInput
                  label="Shirt Size"
                  value={state.shirtSize}
                  onChangeText={(text) => handleInput('shirtSize', text)}
                  editable={isEditable}
                />
                <CustomInput
                  label="Pant Size"
                  value={state.pantSize}
                  onChangeText={(text) => handleInput('pantSize', text)}
                  editable={isEditable}
                />
              </>
            ) : (
              <CustomInput
                label="Chudi Size"
                value={state.chudiSize}
                onChangeText={(text) => handleInput('chudiSize', text)}
                editable={isEditable}
              />
            )}

            <CustomInput
              label="Shoe Size"
              value={state.shoeSize}
              onChangeText={(text) => handleInput('shoeSize', text)}
              editable={isEditable}
            />

            {accessories.map((key) => (
              <View
                key={key}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: verticalScale(12),
                  alignItems: 'center',
                }}>
                <Text style={{ fontWeight: 'bold', color: 'black' }}>{key.toUpperCase()}</Text>
                <Switch
                  value={state[key]}
                  onValueChange={() => toggleSwitch(key)}
                  disabled={!isEditable}
                />
              </View>
            ))}

            <Pressable
              onPress={postUniformRequest}
              className="flex-row items-center justify-center self-center rounded-xl p-4"
              style={{ backgroundColor: '#07af9b', marginTop: 20 }}>
              <Text className="font-semibold text-white">Request Uniform</Text>
              <FontAwesome
                name={manualGender === 'male' ? 'male' : 'female'}
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
  editable,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  editable: boolean;
}) => (
  <View style={{ marginBottom: verticalScale(12) }}>
    <Text style={{ fontWeight: 'bold', marginBottom: 4, color: 'black' }}>{label}</Text>
    <TextInput
      keyboardType="default"
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      placeholder="Enter value"
      placeholderTextColor="#888"
      style={{
        borderColor: '#ccc',
        borderWidth: 1,
        padding: Platform.OS === 'android' ? 8 : 10,
        borderRadius: 8,
        backgroundColor: '#f2f2f2',
        color: '#000',
      }}
    />
  </View>
);

export default Uniform;
