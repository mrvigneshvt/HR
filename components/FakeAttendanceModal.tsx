import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { configFile } from 'config';
import { Api } from 'class/HandleApi';

const getNextStep = (record: any) => {
  if (!record.check_in_time) return 'check_in';
  if (!record.lunch_in_time) return 'lunch_in';
  if (!record.check_out_time) return 'check_out';
  return 'completed';
};

const getApiUrl = (step: string) => {
  switch (step) {
    case 'check_in':
      return configFile.api.attendance.checkIn();
    case 'lunch_in':
      return configFile.api.attendance.lunchIn();
    case 'check_out':
      return configFile.api.attendance.checkOut();
    default:
      return null;
  }
};

interface FakeModalProps {
  visible: boolean;
  onClose: () => void;
  assignedLocations: any[];
  region: { latitude: number; longitude: number };
  time: string;
  onComplete?: () => void;
}

const FakeAttendanceModal: React.FC<FakeModalProps> = ({
  visible,
  onClose,
  assignedLocations,
  region,
  time,
  onComplete,
}) => {
  const [selectedClient, setSelectedClient] = useState<string>('');

  const handleFakePunch = async () => {
    const selected = assignedLocations.find((a) => a.client_no === selectedClient);
    if (!selected) return Alert.alert('Error', 'No record found');

    const step = getNextStep(selected);
    if (step === 'completed') return Alert.alert('Done', 'All steps already done');

    const url = getApiUrl(step);
    if (!url) return Alert.alert('Error', 'Invalid step');

    const payload = {
      [`${step}_time`]: time,
      latitude: region.latitude,
      longitude: region.longitude,
      attendanceId: selected.id,
      isFake: true,
    };

    console.log(url, '//', payload);

    const response = await Api.handleApi({ url, type: 'POST', payload });
    console.log(response);
    Alert.alert(response.status < 210 ? 'Success' : 'Failed', response.data.message);

    onClose?.();
    onComplete?.();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Fake Attendance</Text>

          <View style={styles.pickerContainer}>
            <Picker
              style={{ color: 'grey' }}
              selectedValue={selectedClient}
              onValueChange={(itemValue) => setSelectedClient(itemValue)}>
              <Picker.Item label="Choose client" value="" />
              {assignedLocations.map((rec) => (
                <Picker.Item key={rec.id} label={rec.client_no} value={rec.client_no} />
              ))}
            </Picker>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, { opacity: selectedClient ? 1 : 0.6 }]}
              onPress={handleFakePunch}
              disabled={!selectedClient}>
              <Text style={styles.btnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FakeAttendanceModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: 'black',
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#fff',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  submitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
