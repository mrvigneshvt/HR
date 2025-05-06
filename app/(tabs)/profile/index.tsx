import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { Stack, useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import ImageCom from 'components/ImageCom';
import LoadingScreen from 'components/LoadingScreen';
import { configFile } from '../../../config';
import ProfileStack from 'Stacks/HeaderStack';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const isFocussed = useIsFocused();
  const path = usePathname();

  let { aadhar, empId }: any = useLocalSearchParams();

  aadhar = 34567890;
  empId = 34567890;

  // console.log(aadhar, empId);

  const router = useRouter();

  const [form, setForm] = useState<any>({
    empId: empId,
    name: 'Vignesh',
    fatherOrHusbandName: 'Vicky',
    presentAddress: 'Lyzoo Technologies, Pallikarani, Chennai',
    sameAddress: true,
    permanentAddress: 'Lyzoo Technologies, Pallikarani, Chennai',
    phone: '+917010892470',
    email: 'mrvigneshvt@gmail.com',
    dob: new Date(),
    age: 22,
    gender: 'Male',
    maritalStatus: 'Single',
    religion: 'Hindu',
    height: '188',
    weight: '60',
    physicallyChallenged: false,
    voterId: '234567890',
    panCard: '34567890',
    passportNumber: '9876342',
    esciNo: '34567890',
    uanNo: '087543',
    familyDetails: {
      employeeId: empId,
      name: 'Ganesh',
      relationship: 'Brother',
      dateOfBirth: new Date(),
      aadharNumber: '23456789',
    },
  });

  const [marital, setMarital] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiGetUpdate, setApiGetUpdate] = useState(true);
  const [successUpdate, setSuccessUpdate] = useState(false);

  useEffect(() => {
    const getInfo = async () => {
      const request = await fetch(`http://192.168.0.113:3000/getPro/${empId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await request.json();

      console.log(response, 'apicallRESS');

      if (request.status === 200) {
        if (response.responseData) {
          setForm({
            ...response.responseData,
            dob: new Date(response.responseData.dob),
            familyDetails: {
              ...response.responseData.familyDetails,
              dateOfBirth: new Date(response.responseData.familyDetails.dateOfBirth),
            },
          });

          setApiGetUpdate(true);

          console.log(form);
        }
      }
    };

    getInfo();
  }, []);

  useEffect(() => {
    if (form.sameAddress) {
      setForm((prev) => ({ ...prev, permanentAddress: prev.presentAddress }));
    }
  }, [form.sameAddress, form.presentAddress]);

  useEffect(() => {
    const today = new Date();
    console.log(form.dob, 'form-dobbb');
    if (form.dob) {
      const ageCalc = today.getFullYear() - form.dob.getFullYear();
      setForm((prev) => ({ ...prev, age: ageCalc }));
    }
  }, [form.dob]);

  const handleSave = async () => {
    try {
      setLoading(true);

      const body = JSON.stringify({ aadhar, ...form });

      console.log(body);
      const res = await fetch('http://192.168.0.113:3000/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      console.log(res.status);

      const data = await res.json();
      console.log('Saved successfully', data);
      if (data.message === 'UPDATED') {
        setForm({
          ...data.responseData,
          dob: new Date(data.responseData.dob),
          familyDetails: {
            ...data.responseData.familyDetails,
            dateOfBirth: new Date(data.responseData.familyDetails.dateOfBirth),
          },
        });
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: any, sub?: boolean) => {
    setForm((prev: any) => {
      if (sub) {
        const [parentKey, childKey] = key.split('.');
        return {
          ...prev,
          [parentKey]: {
            ...prev[parentKey],
            [childKey]: value,
          },
        };
      } else {
        return {
          ...prev,
          [key]: value,
        };
      }
    });
  };

  if (!apiGetUpdate) {
    return (
      <>
        <LoadingScreen />
      </>
    );
  }
  return (
    <>
      {
        //<ProfileStack Profile={true} />
      }
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View className={` p-4 bg-[${configFile.colorGreen}] h-screen`}>
            <ScrollView
              className=" h-5/6 flex-1  rounded-xl bg-white p-6"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 180 }}>
              <View className="mb-5 ">
                <View className="flex items-center ">
                  <ImageCom ProfileScreen={true} />
                </View>
                <Text className="mb-2 text-lg font-bold text-[#238c58]">Profile Information:</Text>
                <Text className="mb-1 font-semibold">EmployeeID:</Text>

                <TextInput
                  editable={false}
                  className=" mb-3 rounded bg-white px-3 py-2"
                  value={`${form.empId} (EMPLOYEE ID)`}
                />

                <TextInput
                  className="mb-3 border bg-white px-3 py-2"
                  placeholder="Full Name"
                  value={form.name}
                  onChangeText={(text) => handleChange('name', text)}
                />
                <TextInput
                  className="mb-3 border bg-white px-3 py-2"
                  placeholder="Father/Husband Name"
                  value={form.fatherOrHusbandName}
                  onChangeText={(text) => handleChange('fatherOrHusbandName', text)}
                />
                <TextInput
                  className="mb-3 border bg-white px-3 py-2"
                  placeholder="Present Address"
                  value={form.presentAddress}
                  onChangeText={(text) => handleChange('presentAddress', text)}
                />

                <View className="mb-3 flex-row items-center">
                  <Switch
                    value={form.sameAddress}
                    onValueChange={(val) => handleChange('sameAddress', val)}
                  />
                  <Text className="ml-2">Same for permanent address</Text>
                </View>

                <TextInput
                  className="mb-3 border bg-white px-3 py-2"
                  placeholder="Permanent Address"
                  value={form.permanentAddress}
                  onChangeText={(text) => handleChange('permanentAddress', text)}
                  editable={!form.sameAddress}
                />
                <TextInput
                  className="mb-3 border bg-white px-3 py-2"
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  value={form.phone}
                  onChangeText={(text) => handleChange('phone', text)}
                />
                <TextInput
                  className="mb-3 border bg-white px-3 py-2"
                  placeholder="Email"
                  keyboardType="email-address"
                  value={form.email}
                  onChangeText={(text) => handleChange('email', text)}
                />

                <Pressable
                  className="mb-3 border px-3 py-2"
                  onPress={() => setShowDatePicker(true)}>
                  <Text className="text-gray-700">DOB: {format(form.dob, 'dd-MM-yyyy')}</Text>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    maximumDate={new Date(2025, 12, 29)}
                    value={form.dob}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) handleChange('dob', selectedDate);
                    }}
                  />
                )}
                <Text className="mb-3">Age: {form.age}</Text>

                {/* Gender Selection */}
                <Text className="mb-1 font-semibold">Gender:</Text>
                <View className="mb-3 flex-row gap-4">
                  {['Male', 'Female'].map((g) => (
                    <Pressable
                      key={g}
                      className={`rounded border px-4 py-2 ${
                        form.gender === g ? 'bg-[#238c58]' : 'bg-white'
                      }`}
                      onPress={() => handleChange('gender', g)}>
                      <Text className={form.gender === g ? 'font-bold text-white' : 'text-black'}>
                        {g}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {/* Marital Status */}
                <Text className="mb-1 font-semibold">Marital Status:</Text>
                <View className="mb-3 flex-row gap-4">
                  {['Single', 'Married'].map((s) => (
                    <Pressable
                      key={s}
                      className={`rounded border px-4 py-2 ${
                        form.maritalStatus === s ? 'bg-[#238c58]' : 'bg-white'
                      }`}
                      onPress={() => {
                        handleChange('maritalStatus', s);

                        setMarital(true);
                      }}>
                      <Text
                        className={
                          form.maritalStatus === s ? 'font-bold text-white' : 'text-black'
                        }>
                        {s}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {marital && (
                  <>
                    <View className="mb-3 rounded-lg bg-[#238c58] p-3">
                      <Text className="mb-3 self-center rounded-xl bg-black  p-2  font-semibold text-white">
                        Marital Information:
                      </Text>

                      <TextInput
                        className="mb-3 border bg-white px-3 py-2"
                        placeholder="Name"
                        value={form.familyDetails.name}
                        onChangeText={(text) => handleChange('familyDetails.name', text, true)}
                      />
                      <TextInput
                        className="mb-3 border bg-white px-3 py-2"
                        placeholder="Relationship"
                        value={form.familyDetails.relationship}
                        onChangeText={(text) =>
                          handleChange('familyDetails.relationship', text, true)
                        }
                      />
                      <TextInput
                        className="mb-3 border bg-white px-3 py-2"
                        placeholder="Aadhar Number"
                        keyboardType="numeric"
                        maxLength={16}
                        value={form.familyDetails.aadharNumber}
                        onChangeText={(text) =>
                          handleChange('familyDetails.aadharNumber', text, true)
                        }
                      />
                      <Pressable
                        className="mb-3 border bg-white px-3 py-2"
                        onPress={() => setShowDate(true)}>
                        <Text className=" bg-white text-black">
                          DOB: {format(form.familyDetails.dateOfBirth, 'dd-MM-yyyy')}
                        </Text>
                      </Pressable>
                      {showDate && (
                        <DateTimePicker
                          value={form.familyDetails.dateOfBirth}
                          maximumDate={new Date(2025, 12, 29)}
                          mode="date"
                          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                          onChange={(event, selectedDate) => {
                            setShowDate(false);
                            if (selectedDate)
                              handleChange('familyDetails.dateOfBirth', selectedDate, true);
                          }}
                        />
                      )}
                    </View>
                  </>
                )}

                <TextInput
                  className="mb-3 border bg-white px-3 py-2"
                  placeholder="Religion"
                  value={form.religion}
                  onChangeText={(text) => handleChange('religion', text)}
                />
                <TextInput
                  className="mb-3 border bg-white px-3 py-2"
                  placeholder="Height (cm)"
                  keyboardType="numeric"
                  value={form.height}
                  onChangeText={(text) => handleChange('height', text)}
                />
                <TextInput
                  className="mb-3 border bg-white px-3 py-2"
                  placeholder="Weight (kg)"
                  keyboardType="numeric"
                  value={form.weight}
                  onChangeText={(text) => handleChange('weight', text)}
                />

                <View className="mb-3 flex-row items-center">
                  <Switch
                    value={form.physicallyChallenged}
                    onValueChange={(val) => handleChange('physicallyChallenged', val)}
                  />
                  <Text className="ml-2">Physically Challenged</Text>
                </View>

                <TextInput
                  className="mb-3 border bg-gray-100 px-3 py-2"
                  value={aadhar?.toString()}
                  editable={false}
                />
                <TextInput
                  className="mb-3 border bg-white px-3 py-2"
                  placeholder="Voter ID"
                  value={form.voterId}
                  onChangeText={(text) => handleChange('voterId', text)}
                />
                <TextInput
                  className="mb-3 border bg-white px-3 py-2"
                  placeholder="PAN Card"
                  value={form.panCard}
                  onChangeText={(text) => handleChange('panCard', text)}
                />
                <TextInput
                  className="mb-3 border bg-white px-3 py-2"
                  placeholder="Passport Number"
                  value={form.passportNumber}
                  onChangeText={(text) => handleChange('passportNumber', text)}
                />
                <TextInput
                  className="mb-3 border bg-white px-3 py-2"
                  placeholder="ESCI Number"
                  value={form.esciNo}
                  onChangeText={(text) => handleChange('esciNo', text)}
                />
                <TextInput
                  className="mb-3 border bg-white px-3 py-2"
                  placeholder="UAN Number"
                  value={form.uanNo}
                  onChangeText={(text) => handleChange('uanNo', text)}
                />

                <Pressable
                  className={`mt-4 rounded py-3 ${loading ? 'bg-gray-400' : 'bg-[#238c58]'}`}
                  onPress={handleSave}
                  disabled={loading}>
                  <Text className="text-center font-bold text-white">
                    {loading ? 'Saving...' : 'Save'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
