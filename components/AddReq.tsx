import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Fontisto } from '@expo/vector-icons';
import { router } from 'expo-router';

interface IconModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  empId: string;
  role: string;
}

const IconModal: React.FC<IconModalProps> = ({ showModal, setShowModal, role, empId }) => {
  const redirect = (from: 'uniform' | 'leave') => {
    router.replace({
      pathname: from !== 'leave' ? '/emp-plugins/uniform_request' : '/emp-plugins/leave_request',
      params: {
        role,
        empId,
      },
    });
  };
  return (
    <Modal
      visible={showModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowModal(false)}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconRow}>
            <TouchableOpacity
              style={[styles.iconBox, styles.blueBox]}
              onPress={() => redirect('uniform')}>
              <Ionicons name="shirt" size={30} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconBox, styles.greenBox]}
              onPress={() => redirect('leave')}>
              <Fontisto name="holiday-village" size={30} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default IconModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  iconBox: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueBox: {
    backgroundColor: '#d0ebff', // light blue
  },
  greenBox: {
    backgroundColor: '#d3f9d8', // light green
  },
  cancelButton: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelText: {
    fontWeight: '600',
    color: '#333',
  },
});
