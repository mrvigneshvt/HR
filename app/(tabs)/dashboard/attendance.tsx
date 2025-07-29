import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  FlatList,
  Animated,
  Modal,
  TextInput,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { configFile } from 'config';
import { router, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { NavRouter } from 'class/Router';

const AttendanceMapScreen = () => {
  const { empId: employeeId, role, company } = useLocalSearchParams();

  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [punching, setPunching] = useState(false);
  const [askInsideModal, setAskInsideModal] = useState(false);
  const [outModal, setOutModal] = useState(false);
  const [outTitle, setOutTitle] = useState('');
  const [outNotes, setOutNotes] = useState('');

  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [filterType, setFilterType] = useState('client');

  const rotateAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  useEffect(() => {
    NavRouter.BackHandler({ role, company, empId: employeeId });
  }, [employeeId, company, role]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Location permission is needed to punch in.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setLoadingLocation(false);
    })();
  }, []);

  const doPunchIn = async (title, notes) => {
    if (outModal && !title && !notes)
      return Alert.alert(
        'Missing Title & Notes',
        'Title and Notes are Mandatory Fields that Help the Department to understand Where you Are !'
      );
    setPunching(true);
    try {
      const now = new Date();
      const punch_time = now.toTimeString().split(' ')[0];
      const payload = {
        employeeId,
        punch_time,
        latitude: location.latitude,
        longitude: location.longitude,
        ...(title ? { title, notes } : {}),
      };
      const { data, status } = await axios.post(
        `${configFile.backendBaseUrl}api/attendance/punchIn`,
        payload
      );
      if (status === 201) {
        const msg =
          data.type === 'client' && data.client
            ? `Attendance punched for ${data.client.client_no} / ${data.client.company_name}`
            : 'Attendance punched as Others';
        Alert.alert('Punch Successful', msg);
        router.replace({
          pathname: '/(admin)/home/',
          params: { role, company, empId: employeeId },
        });
      } else {
        Alert.alert('Unexpected response', JSON.stringify(data));
      }
    } catch (err) {
      if (err.response) {
        const { status: code, data } = err.response;
        if (code === 400 && data.errors)
          Alert.alert('Validation Error', JSON.stringify(data.errors));
        else if (code === 404) Alert.alert('Error', data.message || 'Employee not found');
        else Alert.alert('Server Error', data.message || 'Internal error');
      } else {
        Alert.alert('Network Error', err.message);
      }
    } finally {
      setPunching(false);
      setAskInsideModal(false);
      setOutModal(false);
      setOutTitle('');
      setOutNotes('');
    }
  };

  const handleLogoutPunch = () => {
    if (punching || !mapLoaded) return;
    doPunchIn('Logout', 'End of Day');
  };

  const fetchHistory = async (pageNum = 1, type = filterType) => {
    setLoadingHistory(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const nextDay = format(new Date(Date.now() + 86400000), 'yyyy-MM-dd');
      const res = await axios.get(`${configFile.backendBaseUrl}api/attendance/punchDetails`, {
        params: {
          employeeId,
          startDate: today,
          endDate: nextDay,
          page: pageNum,
          limit: 10,
          type,
        },
      });
      const { data: items, summary } = res.data;
      setTotalPages(summary.totalPages);
      setPage(summary.currentPage);
      setHistory(pageNum === 1 ? items : [...history, ...items]);
    } catch (err) {
      Alert.alert('Error fetching history', err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  const onEndReached = () => {
    if (page < totalPages && !loadingHistory) fetchHistory(page + 1);
  };

  if (loadingLocation) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={configFile.colorGreen} />
        <Text style={styles.loadingText}>Fetching your location...</Text>
      </View>
    );
  }

  const region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : null}
        initialRegion={region}
        onMapReady={() => setMapLoaded(true)}>
        <Marker coordinate={location} />
      </MapView>

      {!mapLoaded && (
        <View style={styles.mapLoader}>
          <ActivityIndicator size="large" color={configFile.colorGreen} />
        </View>
      )}

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogoutPunch}
        disabled={punching || !mapLoaded}>
        <MaterialIcons name="logout" size={26} color="#fff" />
        <Text className="text-xl font-bold">End Of Day</Text>
      </TouchableOpacity>

      {/* History button */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => {
          setShowHistory(true);
          fetchHistory(1);
        }}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <MaterialIcons name="history" size={28} color={configFile.colorGreen} />
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, (punching || !mapLoaded) && styles.buttonDisabled]}
          onPress={() => setAskInsideModal(true)}
          disabled={punching || !mapLoaded}>
          {punching ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Punch In</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal transparent visible={askInsideModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View className="flex-row justify-between">
              <Text style={styles.modalTitle}>Are you inside client location?</Text>
              <TouchableOpacity onPress={() => setAskInsideModal(!askInsideModal)}>
                <Entypo name="cross" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={() => doPunchIn()}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setAskInsideModal(false);
                  setOutModal(true);
                }}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={outModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View className="flex-row justify-between">
              <Text style={styles.modalTitle}>Please enter title and notes</Text>
              <TouchableOpacity onPress={() => setOutModal(!outModal)}>
                <Entypo name="cross" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Title"
              placeholderTextColor={'gray'}
              value={outTitle}
              onChangeText={setOutTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Notes"
              placeholderTextColor={'gray'}
              value={outNotes}
              onChangeText={setOutNotes}
              style={[styles.input, { height: 80 }]}
              multiline
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => doPunchIn(outTitle, outNotes)}>
              <Text style={styles.modalButtonText} className="text-white">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showHistory && (
        <View style={styles.historyContainer}>
          <View className="mb-2 flex flex-row justify-center ">
            <Text
              className="rounded-lg bg-gray-200 p-1 text-2xl font-semibold text-black"
              style={{ color: configFile.colorGreen }}>
              Today Attendance
            </Text>
          </View>
          <View style={styles.tabContainer}>
            {['client', 'others'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tab, filterType === t && styles.activeTab]}
                onPress={() => {
                  setFilterType(t);
                  fetchHistory(1, t);
                }}>
                <Text style={[styles.tabText, filterType === t && styles.activeTabText]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {loadingHistory && page === 1 ? (
            <ActivityIndicator size="large" color={configFile.colorGreen} />
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.5}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.recordItem,
                    item.type === 'client' ? styles.clientCard : styles.othersCard,
                  ]}>
                  <Text style={styles.recordText}>Date: {item.attendance_date}</Text>
                  <Text style={styles.recordText}>Time: {item.check_in_time}</Text>
                  {item.type === 'client' ? (
                    <Text style={styles.recordText}>
                      Client: {item.client_no} ({item.company_name})
                    </Text>
                  ) : (
                    <Text style={styles.recordText}>Others Location</Text>
                  )}
                </View>
              )}
              ListEmptyComponent={<Text style={styles.noData}>No records found.</Text>}
            />
          )}
          <TouchableOpacity style={styles.closeHistory} onPress={() => setShowHistory(false)}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 8, fontSize: 16, color: '#555' },
  map: { flex: 1 },
  mapLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 24,
  },
  logoutButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 10,
    backgroundColor: '#fa1937',
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  footer: { padding: 16, backgroundColor: '#fff' },
  button: {
    backgroundColor: configFile.colorGreen,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#999' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: { width: '80%', backgroundColor: '#fff', padding: 16, borderRadius: 8 },
  modalTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: 'black' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: {
    padding: 20,
    backgroundColor: configFile.colorGreen,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  modalButtonText: { color: '#fff', fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    color: 'black',
  },
  historyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  tabContainer: { flexDirection: 'row', marginBottom: 12 },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: { borderColor: configFile.colorGreen },
  tabText: { color: '#555', fontSize: 14 },
  activeTabText: { color: configFile.colorGreen, fontWeight: '600' },
  recordItem: { padding: 12, borderRadius: 8, marginBottom: 8 },
  clientCard: { backgroundColor: '#e0f7e9' },
  othersCard: { backgroundColor: '#f0f0f0' },
  recordText: { fontSize: 14, color: '#333' },
  noData: { textAlign: 'center', color: '#888', marginTop: 16 },
  closeHistory: { marginTop: 12, alignSelf: 'center' },
  closeText: { color: configFile.colorGreen, fontSize: 14, fontWeight: '600' },
});

export default AttendanceMapScreen;
