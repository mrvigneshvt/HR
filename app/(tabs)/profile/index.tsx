import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Image,
  Linking,
} from 'react-native';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEmployeeStore } from 'Memory/Employee';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import ImageCom from 'components/ImageCom';
import LoadingScreen from 'components/LoadingScreen';
import { configFile } from '../../../config';
import { EsiCard } from 'components/EsiCard';
import { NavRouter } from 'class/Router';
import { useLocalSearchParams } from 'expo-router';
import { company } from '../../../Memory/Token';

export default function ProfileScreen() {
  const { company, role, empId } = useLocalSearchParams() as {
    company: company;
    role: string;
    empId: string;
  };
  const employees = useEmployeeStore((state) => state.employee);
  const [form, setForm] = useState<any>({});
  const [showEsiCard, setShowEsiCard] = useState(false);

  useEffect(() => {
    if (employees) {
      setForm({
        ...employees,
        dob: employees.dob || '',
        age: employees.age || '',
        profileImage: employees.profile_image,
      });
    }
    NavRouter.BackHandler({ role: employees?.role, empId, company });
  }, [employees]);

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  if (!employees) return <LoadingScreen />;

  const fields = [
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
    { label: 'Communication Address', key: 'communication_address', multiline: true },
  ];

  const esiCardUrl: string = form.esi_card || '';
  const isValidUrl = esiCardUrl.startsWith('http');
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(esiCardUrl);
  const isPdfOrOther = /\.(pdf|doc|docx|ppt|pptx)$/i.test(esiCardUrl);

  const handleOpenExternal = async () => {
    if (await Linking.canOpenURL(esiCardUrl)) {
      await Linking.openURL(esiCardUrl);
    } else {
      alert('Cannot open file');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Profile Image */}
          <View className="mb-4 items-center">
            <ImageCom img={form.profileImage || null} ProfileScreen={true} />
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

          {/* Render Input Fields */}
          {fields.map((field, index) => (
            <TextInput
              key={index}
              placeholderTextColor={'grey'}
              className="mb-3 rounded px-3 py-2 text-black"
              placeholder={field.label}
              value={form[field.key] || ''}
              editable={false}
              multiline={field.multiline}
              keyboardType={field.keyboardType}
              style={{
                borderWidth: 1,
                borderColor: configFile.colorGreen,
                backgroundColor: '#fff',
              }}
            />
          ))}

          {/* DOB */}
          <View
            style={{
              borderWidth: 1,
              borderColor: configFile.colorGreen,
              borderRadius: moderateScale(6),
              paddingVertical: verticalScale(10),
              paddingHorizontal: scale(12),
              marginBottom: verticalScale(12),
              backgroundColor: '#fff',
            }}>
            <Text style={{ color: '#444' }}>
              DOB: {form.dob ? format(new Date(form.dob), 'dd-MM-yyyy') : 'Not Available'}
            </Text>
          </View>

          {/* ESI Card Section */}
          {isValidUrl && (
            <Pressable
              onPress={() => setShowEsiCard((prev) => !prev)}
              style={{
                borderWidth: 1,
                borderColor: configFile.colorGreen,
                borderRadius: 6,
                padding: 12,
                backgroundColor: '#f0f0f0',
                marginBottom: 10,
              }}>
              <Text style={{ color: configFile.colorGreen, textAlign: 'center' }}>
                {showEsiCard ? 'Hide ESI Card' : 'Show ESI Card'}
              </Text>
            </Pressable>
          )}

          {showEsiCard && isValidUrl && (
            <>
              {/* {isImage ? (
                <Image
                  source={{ uri: esiCardUrl }}
                  style={{
                    width: '100%',
                    height: 180,
                    resizeMode: 'contain',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#ccc',
                  }}
                />
              ) : isPdfOrOther ? (
                <Pressable
                  onPress={handleOpenExternal}
                  style={{
                    marginTop: 10,
                    backgroundColor: configFile.colorGreen,
                    padding: 14,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Open ESI Document</Text>
                </Pressable>
              ) : (
                <Text style={{ color: 'red', marginTop: 10 }}>Unsupported ESI Card format</Text>
              )} */}
              <EsiCard
                esiCardUrl={esiCardUrl}
                isImage={isImage}
                isValidUrl={isValidUrl}
                isPdfOrOther={isPdfOrOther}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
