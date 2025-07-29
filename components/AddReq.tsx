import React, { useEffect } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Fontisto } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { NavRouter } from 'class/Router';
import { company } from 'Memory/Token';

interface IconModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  empId: string;
  role: string;
  company: company;
}

const IconModal: React.FC<IconModalProps> = ({ showModal, setShowModal, role, empId, company }) => {
  const redirect = (from: 'uniform' | 'leave' | 'id') => {
    const path =
      from === 'uniform'
        ? '/emp-plugins/uniform_request'
        : from === 'leave'
          ? '/emp-plugins/leave_request'
          : '/emp-plugins/id_card_request';

    router.replace({
      pathname: path,
      params: { role, empId, company },
    });
  };

  useEffect(() => {
    NavRouter.backOrigin({ role, empId });
  }, []);

  const IconButton = ({
    onPress,
    children,
    bgColor,
  }: {
    onPress: () => void;
    children: React.ReactNode;
    bgColor: string;
  }) => (
    <TouchableOpacity style={[styles.iconBox, { backgroundColor: bgColor }]} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={showModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowModal(false)}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconRow}>
            <IconButton onPress={() => redirect('uniform')} bgColor="#d0ebff">
              <Ionicons name="shirt" size={30} color="#333" />
            </IconButton>
            <IconButton onPress={() => redirect('leave')} bgColor="#d3f9d8">
              <Fontisto name="holiday-village" size={30} color="#333" />
            </IconButton>
            <IconButton onPress={() => redirect('id')} bgColor="#fcefc7">
              <AntDesign name="idcard" size={26} color="#333" />
            </IconButton>
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
    backgroundColor: '#fff',
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
