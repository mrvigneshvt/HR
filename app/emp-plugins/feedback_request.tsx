import React, { useState, useCallback, useEffect, useMemo, useReducer } from 'react';
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
  Share,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import { Api } from 'class/HandleApi';
import { configFile } from 'config';
import PaginatedComponent from 'components/Pagination';
import EntityDropdown from 'components/DropDown';
import FeedbackCard from 'components/FeedbackCard';
import { NavRouter } from 'class/Router';
import { Colors } from 'class/Colors';

// Combine modal state with reducer
const initialModalState = { visible: false, clientId: '', feedback: null };
function modalReducer(state, action) {
  switch (action.type) {
    case 'OPEN':
      return { visible: true, clientId: '', feedback: null };
    case 'SET_ID':
      return { ...state, clientId: action.payload };
    case 'SET_FEEDBACK':
      return { ...state, feedback: action.payload };
    case 'CLOSE':
      return initialModalState;
    default:
      return state;
  }
}

const FeedbackRequest = () => {
  const params = useLocalSearchParams();
  console.log(params);
  const { company: companyParam, empId, role } = params;
  NavRouter.BackHandler({ role, empId, company: companyParam });

  const isFocused = useIsFocused();

  // sync company only when focused
  const [company, setCompany] = useState(companyParam);
  useEffect(() => {
    console.log('feeed Back Handler: ', role, '/', companyParam, '/', empId);
    setCompany(companyParam);
  }, [isFocused]);

  const [refreshKey, setRefreshKey] = useState(0);
  const reloadList = useCallback(() => setRefreshKey((k) => k + 1), []);

  // modal state
  const [modalState, dispatch] = useReducer(modalReducer, initialModalState);

  // memoize list URL
  const listUrl = useMemo(() => {
    const base = configFile.api.superAdmin.app.feedback.get;
    return company === 'sdce' ? base : `${base}?prefix=sq`;
  }, [company]);

  // modal controls
  const openModal = useCallback(() => dispatch({ type: 'OPEN' }), []);
  const closeModal = useCallback(() => dispatch({ type: 'CLOSE' }), []);

  // submit feedback
  const handleSubmit = useCallback(async () => {
    if (!modalState.clientId) {
      return Alert.alert('Missing Fields', 'Please select a client');
    }
    try {
      const res = await Api.handleApi({
        url: configFile.api.superAdmin.app.feedback.post,
        type: 'POST',
        payload: { client_id: modalState.clientId },
      });
      if (res.status === 201) {
        dispatch({ type: 'SET_FEEDBACK', payload: res.data });
      } else {
        Alert.alert('❌ Failed', res.data.message || 'Something went wrong');
      }
    } catch {
      Alert.alert('❌ Error', 'Failed to submit feedback');
    }
  }, [modalState.clientId]);

  // copy / share
  const copyUrl = useCallback(async (url) => {
    await Clipboard.setStringAsync(url);
    Alert.alert('Copied to Clipboard');
  }, []);
  const shareUrl = useCallback(async (url) => {
    await Share.share({ message: url, title: 'Feedback Form URL' });
  }, []);

  // render each feedback row
  const renderItem = useCallback(
    ({ item }) => <FeedbackCard item={item} onDelete={reloadList} />,
    [reloadList]
  );

  // form section extracted
  const FormSection = useCallback(() => {
    if (!modalState.feedback) return null;
    const { clientId, clientName, clientMobileNumber, companyName, formUrl } = modalState.feedback;
    return (
      <View>
        {[
          [`Client ID: ${clientId}`],
          [`Name: ${clientName}`],
          [`Mobile: ${clientMobileNumber}`],
          [`Company: ${companyName}`],
        ].map((line, i) => (
          <Text key={i} style={styles.detail}>
            {line}
          </Text>
        ))}
        <Text style={[styles.detail, styles.sectionTitle]}>Form URL</Text>
        <View style={styles.urlBox}>
          <TextInput value={formUrl} editable={false} style={styles.urlInput} selectTextOnFocus />
          <Pressable onPress={() => copyUrl(formUrl)}>
            <Feather name="copy" size={22} color={configFile.colorGreen} />
          </Pressable>
          <Pressable onPress={() => shareUrl(formUrl)} style={styles.icon}>
            <Ionicons name="share-social-outline" size={22} color={configFile.colorGreen} />
          </Pressable>
        </View>
      </View>
    );
  }, [modalState.feedback, copyUrl, shareUrl]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: Colors.get(company, 'bg') }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Client Feedback',
          headerStyle: { backgroundColor: configFile.colorGreen },
          headerTintColor: 'white',
          headerRight: () => (
            <TouchableOpacity onPress={openModal} style={styles.headerBtn}>
              <Ionicons name="add-circle" size={30} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      {listUrl ? (
        <PaginatedComponent
          key={refreshKey}
          url={listUrl}
          limit={10}
          renderItem={renderItem}
          containerStyle={styles.list}
        />
      ) : (
        <ActivityIndicator style={styles.loader} size="large" color={configFile.colorGreen} />
      )}

      <Modal
        visible={modalState.visible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {!modalState.feedback ? (
              <>
                <Text style={styles.modalTitle}>Submit Feedback</Text>
                <EntityDropdown
                  type="client"
                  setState={(id) => dispatch({ type: 'SET_ID', payload: id })}
                  returnFullObject={false}
                  placeholder="Search Client"
                  inputStyle={styles.input}
                  containerStyle={styles.dropdown}
                  itemTextStyle={styles.dropdownItem}
                />
                <View style={styles.btnRow}>
                  <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Submit</Text>
                  </Pressable>
                  <Pressable style={styles.cancelBtn} onPress={closeModal}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <ScrollView contentContainerStyle={styles.resultContainer}>
                <Text style={styles.modalTitle}>🎉 Feedback Form Generated!</Text>
                <FormSection />
                <Pressable style={styles.closeBtn} onPress={closeModal}>
                  <Text style={styles.closeText}>Close</Text>
                </Pressable>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default React.memo(FeedbackRequest);

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerBtn: { marginRight: 12 },
  loader: { flex: 1, justifyContent: 'center' },
  list: { flex: 1 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    elevation: 8,
  },
  modalTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },

  input: {
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
  },
  dropdown: { marginBottom: 16 },
  dropdownItem: { color: 'white' },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: configFile.colorGreen,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#ddd',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  cancelText: { color: '#333', fontWeight: '500', fontSize: 16 },

  resultContainer: { paddingVertical: 16 },
  detail: { fontSize: 15, color: '#333', marginBottom: 8 },
  sectionTitle: { marginTop: 12, fontWeight: '600' },
  urlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 8,
  },
  urlInput: { flex: 1, fontSize: 14, color: configFile.colorGreen },
  icon: { marginLeft: 12 },

  closeBtn: {
    marginTop: 20,
    backgroundColor: configFile.colorGreen,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
