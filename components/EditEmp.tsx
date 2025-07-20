import React, { useEffect, useState } from 'react';
import {
  Modal,
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
  Linking,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { configFile } from 'config';
import { Api } from 'class/HandleApi';
import EntityDropdown from './DropDown';
import { EsiCard } from './EsiCard';

interface EditEmpProps {
  employeeData: Record<string, any>;
  showEditModal: boolean;
  setShowEditModal: (val: boolean) => void;
  onSaveSuccess?: () => void;
  setSelectedEmployee: (val: any) => void;
}

const roles = ['Employee', 'Executive', 'Manager', 'Admin', 'SuperAdmin'];
const maritalStatuses = ['Single', 'Married'];

const EditEmp: React.FC<EditEmpProps> = ({
  employeeData,
  showEditModal,
  setShowEditModal,
  setSelectedEmployee,
  onSaveSuccess,
}) => {
  const [form, setForm] = useState<Record<string, any>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEsiCard, setShowEsiCard] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showEditModal && employeeData) {
      setForm({ ...employeeData });
    }
  }, [showEditModal]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const url = `${configFile.api.superAdmin.app.updateEmp}/${employeeData.employee_id}`;
      const payload = form;
      const api = await Api.handleApi({ url, type: 'PUT', payload });

      if (api.status < 210) {
        Alert.alert('Updated!', api.data.message || 'Employee updated successfully!');
        setShowEditModal(false);
        onSaveSuccess?.();
        setSelectedEmployee(null);
      } else {
        Alert.alert('Failed!', api.data.message || 'Something went wrong while updating.');
      }
    } catch {
      Alert.alert('Error', 'Unable to update employee details.');
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    setShowEditModal(false);
    setSelectedEmployee(null);
  };

  const esiCardUrl: string = form.esi_card || '';
  const isValidUrl = esiCardUrl.startsWith('http');
  // if(isValidUrl){}
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(esiCardUrl);
  const isPdfOrOther = /\.(pdf|doc|docx|ppt|pptx)$/i.test(esiCardUrl);

  const handleOpenExternal = async () => {
    if (await Linking.canOpenURL(esiCardUrl)) {
      await Linking.openURL(esiCardUrl);
    } else {
      alert('Cannot open file');
    }
  };

  const renderImage = (uri?: string, label?: string) =>
    uri?.startsWith('https://') && (
      <View style={styles.imagePreviewContainer}>
        <Text style={styles.label}>{label}</Text>
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      </View>
    );

  const InputField = ({ label, keyName }: { label: string; keyName: string }) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={label}
        placeholderTextColor="#666"
        style={styles.input}
        value={form[keyName] ?? ''}
        onChangeText={(text) => handleChange(keyName, text)}
        editable={!isLoading}
      />
    </View>
  );

  const addReporting = (id: string) => {
    handleChange('reporting', id);
  };

  return (
    <Modal visible={showEditModal} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.header}>Edit Employee</Text>
            {isLoading ? (
              <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 40 }} />
            ) : (
              <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                {/* your form contents stay the same */}
                {renderImage(form.profile_image, 'Profile Image')}
                {renderImage(form.driving_license_card, 'Driving License')}
                {renderImage(form.pan_card, 'PAN Card')}

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
                    <EsiCard
                      esiCardUrl={esiCardUrl}
                      isImage={isImage}
                      isValidUrl={isValidUrl}
                      isPdfOrOther={isPdfOrOther}
                    />
                  </>
                )}

                {[
                  ['Name', 'name'],
                  ['Guardian Name', 'guardian_name'],
                  ['Father/Spouse Name', 'father_spouse_name'],
                  ['Emergency Contact Name', 'emergency_contact_name'],
                  ['Emergency Contact Phone', 'emergency_contact_phone'],
                  ['Driving License', 'driving_license'],
                  ['Designation', 'designation'],
                  ['Department', 'department'],
                  ['Contact Email', 'contact_email'],
                  ['Communication Address', 'communication_address'],
                  ['Branch', 'branch'],
                ].map(([label, key]) => (
                  <InputField key={key} label={label} keyName={key} />
                ))}

                <Text style={styles.label}>Date of Joining</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={[styles.input, styles.dateInput]}>
                  <Text style={{ color: '#000' }}>
                    {new Date(form.date_of_joining).toDateString()}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={new Date(form.date_of_joining)}
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

                <View style={styles.btnContainer}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                    <Text style={styles.btnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.btnText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditEmp;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
    elevation: 10,
    flex: 1,
  },
  scroll: {
    paddingBottom: 80,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginBottom: 15,
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
  },
  option: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginVertical: 4,
  },
  selectedOption: {
    backgroundColor: '#60a5fa',
  },
  btnContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelBtn: {
    backgroundColor: '#6b7280',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  saveBtn: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  imagePreviewContainer: {
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 5,
    backgroundColor: '#e0e0e0',
  },
});
