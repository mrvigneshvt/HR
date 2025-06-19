import React, { useEffect, useState } from 'react';
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
import { format, parseISO } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEmployeeStore } from 'Memory/Employee';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import ImageCom from 'components/ImageCom';
import LoadingScreen from 'components/LoadingScreen';
import { configFile } from '../../../config';

export default function ProfileScreen() {
  const employees = useEmployeeStore((state) => state.employee);

  const [form, setForm] = useState<any>({
    aadhaar_number: '',
    account_number: '',
    address_country: '',
    address_district: '',
    address_house: '',
    address_landmark: '',
    address_po: '',
    address_state: '',
    address_street: '',
    address_zip: '',
    age: '',
    bank_address: '',
    bank_branch: '',
    bank_centre: '',
    bank_city: '',
    bank_code: '',
    bank_contact: '',
    bank_district: '',
    bank_name: '',
    bank_state: '',
    branch: '',
    communication_address: '',
    contact_email: '',
    contact_mobile_no: '',
    date_of_joining: '',
    department: '',
    designation: '',
    dob: '',
    driving_license: '',
    driving_license_card: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    employee_id: '',
    esi_card: '',
    esi_number: '',
    father_spouse_name: '',
    gender: '',
    guardian_name: '',
    marital_status: '',
    micr_code: '',
    name: '',
    pan_card: '',
    pan_number: '',
    profile_image: '',
    reference_id: '',
    reporting: '',
    role: '',
    uan_number: '',
    voter_id: '',
    voter_id_card: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (employees) {
      setForm({
        ...form,
        ...employees,
        dob: employees.dob ? parseISO(employees.dob) : new Date(),
        age: employees.age || '',
        profileImage: employees.profile_image,
      });
    }
  }, [employees]);

  if (!employees) return <LoadingScreen />;

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View className="mb-4 items-center">
            <ImageCom img={employees.profile_image} ProfileScreen={true} />
          </View>

          <Text
            style={{
              fontSize: scale(18),
              fontWeight: 'bold',
              marginBottom: verticalScale(16),
              color: configFile.colorGreen,
              textAlign: 'center',
            }}>
            Profile Details
          </Text>

          {[
            { label: 'ID', key: 'employee_id', editable: false },
            { label: 'Name', key: 'name' },
            { label: 'Father / Spouse Name', key: 'father_spouse_name' },
            { label: 'Contact Email', key: 'contact_email', keyboardType: 'email-address' },
            { label: 'Mobile Number', key: 'contact_mobile_no', keyboardType: 'phone-pad' },
            { label: 'Gender', key: 'gender' },
            { label: 'Marital Status', key: 'marital_status' },
            { label: 'PAN Card', key: 'pan_card' },
            { label: 'UAN Number', key: 'uan_number' },
            { label: 'Aadhaar Number', key: 'aadhaar_number' },
            {
              label: 'Communication Address',
              key: 'communication_address',
              multiline: true,
            },
          ].map((field, index) => (
            <TextInput
              key={index}
              className="mb-3 rounded px-3 py-2 text-black"
              placeholder={field.label}
              value={form[field.key] || ''}
              onChangeText={(text) => handleChange(field.key, text)}
              editable={field.editable !== false}
              multiline={field.multiline}
              keyboardType={field.keyboardType}
              style={{
                borderWidth: 1,
                borderColor: configFile.colorGreen,
                backgroundColor: '#fff',
              }}
            />
          ))}

          {/* DOB Picker */}
          <Pressable
            style={{
              borderWidth: 1,
              borderColor: configFile.colorGreen,
              borderRadius: moderateScale(6),
              paddingVertical: verticalScale(10),
              paddingHorizontal: scale(12),
              marginBottom: verticalScale(12),
              backgroundColor: '#fff',
            }}
            onPress={() => setShowDatePicker(true)}>
            <Text style={{ color: '#444' }}>
              DOB: {form.dob ? format(new Date(form.dob), 'dd-MM-yyyy') : 'Select DOB'}
            </Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={form.dob ? new Date(form.dob) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) handleChange('dob', selectedDate);
              }}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
