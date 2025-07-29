import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { Api } from 'class/HandleApi';
import { configFile } from 'config';

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  empId: string;
  onSave: () => void;
}

const DailyReportModal: React.FC<Props> = ({ showModal, setShowModal, empId, onSave }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!summary.trim()) {
      Alert.alert('Validation Error', 'Please enter a summary');
      return;
    }

    setLoading(true);

    try {
      const response = await Api.handleApi({
        url: 'https://sdce.lyzooapp.co.in:31313/api/reports',
        type: 'POST',
        token: 'your_token_here', // replace with dynamic token ideally
        payload: {
          work_summary: summary,
          employee_id: empId,
        },
      });

      if (response.status === 200 && response.data.status) {
        Alert.alert('Success', 'Report submitted successfully!');
        setSummary('');
        setShowModal(false);
        onSave(); // trigger refetch in parent
      } else {
        Alert.alert('Error', response.data.message || 'Failed to submit');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={showModal}
      animationType="fade"
      transparent
      onRequestClose={() => setShowModal(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Submit Daily Report</Text>

          <Text style={styles.label}>Employee ID</Text>
          <TextInput value={empId} editable={false} style={[styles.input, styles.disabledInput]} />

          <Text style={styles.label}>Work Summary</Text>
          <TextInput
            value={summary}
            onChangeText={setSummary}
            placeholder="Enter your summary"
            style={styles.input}
            placeholderTextColor={'grey'}
            multiline
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={[styles.button, styles.cancelButton]}
              disabled={loading}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.button, styles.submitButton]}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DailyReportModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
  input: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  disabledInput: {
    backgroundColor: '#eee',
    color: '#888',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#aaa',
  },
  submitButton: {
    backgroundColor: configFile.colorGreen,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
