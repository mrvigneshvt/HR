import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Api } from 'class/HandleApi';
import { configFile } from 'config';
import PaginatedComponent from 'components/Pagination';
import EntityDropdown from 'components/DropDown';
import { Colors } from 'class/Colors';
import FeedbackCard from 'components/FeedbackCard';

const FeedbackRequest = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientMsg, setClientMsg] = useState('');
  const [company, setCompany] = useState<'sdce' | 'sq'>('sdce');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmit = async () => {
    if (!clientId) {
      return Alert.alert('Missing Fields', 'Please select a client');
    }

    try {
      const payload = { client_id: clientId };
      console.log(configFile.api.superAdmin.app.feedback.post, '////', clientId);
      const response = await Api.handleApi({
        url: configFile.api.superAdmin.app.feedback.post,
        type: 'POST',
        payload,
      });

      console.log(response);
      Alert.alert(response.status < 210 ? '✅ Submitted' : '❌ Failed', response.data.message);

      setModalVisible(false);
      setClientId('');
      setClientMsg('');
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      Alert.alert('❌ Error', 'Failed to submit feedback');
    }
  };

  const handleDelete = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const switchCompany = () => {
    setCompany((prev) => (prev === 'sdce' ? 'sq' : 'sdce'));
    handleDelete();
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.get(company, 'bg') }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Client Feedback',
          headerStyle: { backgroundColor: configFile.colorGreen },
          headerTintColor: 'white',
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={switchCompany}>
                {company === 'sdce' ? (
                  <MaterialIcons name="security" size={24} color="white" />
                ) : (
                  <MaterialCommunityIcons name="broom" size={24} color="white" />
                )}
              </TouchableOpacity>
              <Pressable onPress={() => setModalVisible(true)}>
                <Ionicons name="add-circle" size={30} color="#fff" />
              </Pressable>
            </View>
          ),
        }}
      />

      {/* Feedback List */}
      <PaginatedComponent
        key={refreshKey}
        url={
          company === 'sdce'
            ? configFile.api.superAdmin.app.feedback.get
            : configFile.api.superAdmin.app.feedback.get + '?prefix=sq'
        }
        limit={10}
        renderItem={(item: any) => <FeedbackCard item={item.item} onDelete={handleDelete} />}
      />

      {/* Feedback Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📝 Generate Feedback Form</Text>

            <EntityDropdown
              type="client"
              setState={setClientId}
              returnFullObject={false}
              placeholder="Search Client"
              inputStyle={styles.input}
              containerStyle={{ marginBottom: 12 }}
              itemTextStyle={{ color: '#333' }}
              listStyle={{
                backgroundColor: 'white',
                borderBottomColor: '#ccc',
              }}
            />

            <View style={styles.btnRow}>
              <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit</Text>
              </Pressable>
              <Pressable style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default FeedbackRequest;

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#000',
  },
  input: {
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 14,
    color: '#000',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: configFile.colorGreen,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 6,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 6,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 16,
  },
});
