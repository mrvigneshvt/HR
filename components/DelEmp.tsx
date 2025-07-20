import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Api } from 'class/HandleApi';
import { configFile } from 'config';

interface DelEmpProps {
  showDeleteModal: boolean;
  setShowDeleteModal: (val: boolean) => void;
  selectedEmployee: any;
  setSelectedEmployee: (val: any) => void;
  onSave: () => void;
}

const DelEmp: React.FC<DelEmpProps> = ({
  showDeleteModal,
  setShowDeleteModal,
  selectedEmployee,
  setSelectedEmployee,
  onSave,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      setLoading(true);

      const url = `${configFile.backendBaseUrl}api/employees/${selectedEmployee.employee_id}`;
      const data = await Api.handleApi({ url, type: 'DELETE' });

      console.log(data, '//data');

      switch (data.status) {
        case 200:
          Alert.alert('Success', 'Employee deleted successfully');
          break;
        case 404:
          Alert.alert('Failed', 'Employee not found');
          break;
        case 500:
          Alert.alert('Failed', 'Internal server error');
          break;
        default:
          Alert.alert('Failed', data.data.message || 'Unexpected response');
      }
    } catch (error) {
      console.log('Error in delete EMP::', error);
      Alert.alert('Error', 'Failed to delete employee');
    } finally {
      setShowDeleteModal(false);
      setSelectedEmployee(null);
      fetchEmployees();
      setLoading(false);
      onSave();
    }
  };

  return (
    <Modal
      visible={showDeleteModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowDeleteModal(false)}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.overlay}
        onPress={() => setShowDeleteModal(false)}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.container}>
            <Text style={styles.title}>Delete Employee</Text>
            <Text style={styles.message}>
              Are you sure you want to delete {selectedEmployee?.name}?
            </Text>
            <View style={styles.actions}>
              <Pressable onPress={() => setShowDeleteModal(false)} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleDeleteEmployee}
                disabled={loading}
                style={[styles.confirmButton, loading && { opacity: 0.5 }]}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.confirmText}>Delete</Text>
                )}
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default DelEmp;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: 'black',
  },
  message: {
    marginBottom: 12,
    color: 'grey',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
    padding: 10,
    borderRadius: 6,
  },
  cancelText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 6,
  },
  confirmText: {
    color: 'white',
    fontWeight: '600',
  },
});
