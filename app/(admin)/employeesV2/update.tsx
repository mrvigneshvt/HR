import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { configFile } from 'config';
import { Api } from 'class/HandleApi';
import { EsiCard } from 'components/EsiCard';
import EntityDropdown from 'components/DropDown';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { NavRouter } from 'class/Router';
import { company } from '../../../Memory/Token';
import ImageCom from 'components/ImageCom';
import { useIsFocused } from '@react-navigation/native';
import EmployeeVerification from 'components/EmployeeVerification';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { Employee } from '../employees';

const roles = ['Employee', 'Executive', 'Manager', 'Admin', 'SuperAdmin'];
const maritalStatuses = ['Single', 'Married'];

const EditEmpScreen = () => {
  const isFocus = useIsFocused();
  const router = useRouter();
  const { data, empId, role, company } = useLocalSearchParams();

  const [form, setForm] = useState<Employee>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEsiCard, setShowEsiCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showVerModal, setShowVerModal] = useState(false);
  const [isAllVerified, setIsAllVerified] = useState(false);

  useEffect(() => {
    NavRouter.BackHandler({ role, empId, route: '/(admin)/employeesV2/', company });
  }, [isFocus]);

  useEffect(() => {
    if (typeof data === 'string') {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        setForm(parsedData);
      } catch (error) {
        console.error('Failed to parse employee data:', error);
        Alert.alert('Error', 'Invalid employee data');
        router.back();
      }
    }
  }, [data]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addReporting = (id: string) => {
    handleChange('reporting', id);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const url = `${configFile.api.superAdmin.app.updateEmp}/${form.employee_id}`;
      console.log(form);
      const api = await Api.handleApi({ url, type: 'PUT', payload: form });

      if (api.status < 210) {
        setShowVerModal(false);
        Alert.alert('Updated!', api.data.message || 'Employee updated successfully!');
        router.replace({ pathname: '/(admin)/home', params: { role, empId, company } });
      } else {
        Alert.alert('Failed!', api.data.message || 'Something went wrong while updating.');
      }
    } catch {
      Alert.alert('Error', 'Unable to update employee details.');
    }
    setIsLoading(false);
  };

  const renderImage = (uri?: string, label?: string) =>
    uri?.startsWith('https://') && (
      <View style={styles.imagePreviewContainer}>
        <Text style={styles.label}>{label}</Text>
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      </View>
    );

  const esiCardUrl: string = form.esi_card || '';
  const isValidUrl = esiCardUrl.startsWith('http');
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(esiCardUrl);
  const isPdfOrOther = /\.(pdf|doc|docx|ppt|pptx)$/i.test(esiCardUrl);

  const renderIcon = () => {
    const isVerified = form.is_aadhaar_verified && form.is_bank_verified;
    console.log(
      isVerified,
      ' //////Verified////',
      form.is_aadhaar_verified,
      '//',
      form.is_bank_verified
    );
    const iconName = isVerified ? 'verified' : 'unverified';

    return (
      <TouchableOpacity
        className="mr-2"
        onPress={() => {
          if (isVerified) {
            Alert.alert('Verified', 'Both Bank and Aadhar are already verified successfully! 🙂');
          } else {
            setShowVerModal(!showVerModal);
          }
        }}>
        <Octicons name={iconName} size={24} color={isVerified ? 'white' : 'red'} />
      </TouchableOpacity>
    );
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Profile / ${form.employee_id}`,
          headerStyle: {
            backgroundColor: configFile.colorGreen,
            elevation: 10,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
          },

          headerRight: () => renderIcon(),
        }}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.select({ ios: 100, android: 0 })}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag">
            {isLoading ? (
              <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 40 }} />
            ) : (
              <Pressable
                style={{ flex: 1, padding: 20, backgroundColor: 'white', minHeight: '100%' }}>
                {form.profileImage && (
                  <View className="mb-4 items-center">
                    <ImageCom img={form.profileImage || null} ProfileScreen={true} />
                  </View>
                )}
                {renderImage(form.driving_license_card, 'Driving License')}
                {renderImage(form.pan_card, 'PAN Card')}
                {isValidUrl && (
                  <Pressable
                    onPress={() => setShowEsiCard((prev) => !prev)}
                    style={styles.toggleButton}>
                    <Text style={styles.toggleText}>
                      {showEsiCard ? 'Hide ESI Card' : 'Show ESI Card'}
                    </Text>
                  </Pressable>
                )}
                {showEsiCard && (
                  <EsiCard
                    esiCardUrl={esiCardUrl}
                    isImage={isImage}
                    isValidUrl={isValidUrl}
                    isPdfOrOther={isPdfOrOther}
                  />
                )}
                {/* Hardcoded fields */}
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={form.name ?? ''}
                  onChangeText={(text) => handleChange('name', text)}
                />
                <Text style={styles.label}>Mobile No:</Text>
                <TextInput
                  inputMode="numeric"
                  style={styles.input}
                  value={form.contact_mobile_no ?? ''}
                  onChangeText={(text) => handleChange('contact_mobile_no', text)}
                />
                <Text style={styles.label}>Guardian Name</Text>
                <TextInput
                  style={styles.input}
                  value={form.guardian_name ?? ''}
                  onChangeText={(text) => handleChange('guardian_name', text)}
                />
                <Text style={styles.label}>Father/Spouse Name</Text>
                <TextInput
                  style={styles.input}
                  value={form.father_spouse_name ?? ''}
                  onChangeText={(text) => handleChange('father_spouse_name', text)}
                />
                <Text style={styles.label}>Emergency Contact Name</Text>
                <TextInput
                  style={styles.input}
                  value={form.emergency_contact_name ?? ''}
                  onChangeText={(text) => handleChange('emergency_contact_name', text)}
                />
                <Text style={styles.label}>Emergency Contact Phone</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="phone-pad"
                  value={form.emergency_contact_phone ?? ''}
                  onChangeText={(text) => handleChange('emergency_contact_phone', text)}
                />
                <Text style={styles.label}>Driving License</Text>
                <TextInput
                  style={styles.input}
                  value={form.driving_license ?? ''}
                  onChangeText={(text) => handleChange('driving_license', text)}
                />
                <Text style={styles.label}>Designation</Text>
                <TextInput
                  style={styles.input}
                  value={form.designation ?? ''}
                  onChangeText={(text) => handleChange('designation', text)}
                />
                <Text style={styles.label}>Department</Text>
                <TextInput
                  style={styles.input}
                  value={form.department ?? ''}
                  onChangeText={(text) => handleChange('department', text)}
                />
                <Text style={styles.label}>Contact Email</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="email-address"
                  value={form.contact_email ?? ''}
                  onChangeText={(text) => handleChange('contact_email', text)}
                />
                <Text style={styles.label}>Communication Address</Text>
                <TextInput
                  style={styles.input}
                  multiline
                  numberOfLines={3}
                  value={form.communication_address ?? ''}
                  onChangeText={(text) => handleChange('communication_address', text)}
                />
                <Text style={styles.label}>Branch</Text>
                <TextInput
                  style={styles.input}
                  value={form.branch ?? ''}
                  onChangeText={(text) => handleChange('branch', text)}
                />
                <Text style={styles.label}>Date of Joining</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={[styles.input, styles.dateInput]}>
                  <Text style={{ color: '#000' }}>
                    {form.date_of_joining
                      ? new Date(form.date_of_joining).toDateString()
                      : 'Select Date'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={form.date_of_joining ? new Date(form.date_of_joining) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(_, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        handleChange('date_of_joining', selectedDate.toISOString());
                      }
                    }}
                  />
                )}
                <Text style={styles.label}>Role</Text>
                <View style={styles.optionGroup}>
                  {roles.map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[styles.option, form.role === role && styles.selectedOption]}
                      onPress={() => handleChange('role', role)}>
                      <Text>{role}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.label}>Marital Status</Text>
                <View style={styles.optionGroup}>
                  {maritalStatuses.map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.option,
                        form.marital_status?.toLowerCase() === status.toLowerCase() &&
                          styles.selectedOption,
                      ]}
                      onPress={() => handleChange('marital_status', status)}>
                      <Text>{status}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.label}>Reporting</Text>
                <EntityDropdown
                  type="employee"
                  setState={addReporting}
                  selected={form.reporting}
                  placeholder="Select Reporting"
                  inputStyle={{
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderWidth: 1,
                    borderRadius: 8,
                    borderColor: '#ccc',
                    backgroundColor: '#fff',
                    fontSize: 16,
                    color: '#000',
                  }}
                  containerStyle={{ marginBottom: 15, marginTop: 0, width: 'auto' }}
                  listStyle={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                    marginTop: 5,
                    maxHeight: 200,
                    backgroundColor: '#fff',
                  }}
                  itemStyle={{
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                  }}
                  itemTextStyle={{
                    color: '#333',
                  }}
                />
                <View style={styles.btnContainer}>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.btnText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            )}
          </ScrollView>
          {showVerModal && (
            <EmployeeVerification
              employee={form}
              visible={showVerModal}
              onClose={() => setShowVerModal(!showVerModal)}
              verifiedData={setForm}
              onVerified={() => {
                console.log('Verified Triggered', form);
                handleSave();
              }}
            />
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default EditEmpScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    color: '#111',
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f0f2f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  dateInput: {
    justifyContent: 'center',
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 10,
  },
  option: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  selectedOption: {
    backgroundColor: '#60a5fa',
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: configFile.colorGreen,
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  toggleText: {
    color: configFile.colorGreen,
    textAlign: 'center',
  },
  btnContainer: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', gap: 10 },
  cancelBtn: { backgroundColor: '#6b7280', padding: 12, borderRadius: 8, flex: 1 },
  saveBtn: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, flex: 1 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  imagePreviewContainer: { marginBottom: 10 },
  image: { width: '100%', height: 180, borderRadius: 12, marginTop: 5, backgroundColor: '#e0e0e0' },
});
