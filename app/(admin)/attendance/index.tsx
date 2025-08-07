import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { configFile } from 'config';
import { isReadOnlyRole } from 'utils/roleUtils';
import { NavRouter } from 'class/Router';
import { Colors } from 'class/Colors';

import AttendFilterModal, { StatusTypes, TypeFilter } from 'components/AttendFilterModal';
import RecordModal from 'components/AttenModal';
import AttendCard from 'components/AttendCard';
import FilterIcon from 'components/FilterIcon';

const BASE_URL = configFile.api.superAdmin.admin;
//attendance index mohinth 'https://sdce.lyzooapp.co.in:31313/api' nigg

const AttendanceScreen = () => {
  const { empId, role } = useLocalSearchParams();
  const isFocused = useIsFocused();
  const readOnly = isReadOnlyRole(role);
  const [myOnly, setMyOnly] = useState(true);

  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [filters, setFilters] = useState<{
    startDate?: string;
    endDate?: string;
    status?: StatusTypes;
    type?: 'others' | 'client';
    employeeId: string;
  }>({
    employeeId: empId?.toString() || '',
    type: 'client',
  });

  useEffect(() => {
    console.log(showFilterModal, '////?SHOW FILTER MODAL');
    console.log(filters, '//filters');
  }, [showFilterModal]);

  const fetchAttendance = useCallback(async () => {
    if (!filters.employeeId) return;

    setLoading(true);
    try {
      const url = myOnly
        ? `${BASE_URL}/attendance/getEmpHistory`
        : `${BASE_URL}/attendance/getTeamHistory`;

      const params = {
        employeeId: filters.employeeId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        status: filters.status,
        type: filters.type,
        page: 1,
        limit: 20,
      };

      console.log(url, '//', params);

      const { data } = await axios.get(url, { params });
      setAttendance(data?.data || []);
    } catch (err) {
      console.error('Error fetching attendance history:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, myOnly]);

  useEffect(() => {
    const cleanup = NavRouter.BackHandler({ role, empId });
    return cleanup;
  }, [role, empId]);

  useEffect(() => {
    if (isFocused) {
      fetchAttendance();
    }
  }, [isFocused, fetchAttendance]);

  const renderItem = useCallback(
    ({ item }) => (
      <AttendCard
        item={item}
        setSelectedItem={setSelectedItem}
        showRecordModal={showRecordModal}
        setShowRecordModal={setShowRecordModal}
      />
    ),
    [showRecordModal]
  );

  const handleDelete = useCallback(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return (
    <View style={[styles.container, { backgroundColor: Colors.get('sdce', 'bg') }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: myOnly ? 'My Attendance' : 'Team Attendance',
          headerStyle: { backgroundColor: configFile.colorGreen },
          headerTintColor: 'white',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setMyOnly((prev) => !prev)}
              style={{ marginRight: 16 }}>
              <MaterialCommunityIcons
                name={myOnly ? 'account-group' : 'account'}
                size={24}
                color={myOnly ? '#FFD700' : 'white'}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <FilterIcon
        filters={filters}
        onPress={() => {
          setShowFilterModal(!showFilterModal);
        }}
      />
      {showFilterModal && (
        <AttendFilterModal
          showFilterModal={showFilterModal}
          setShowFilterModal={setShowFilterModal}
          setFilters={setFilters}
          empId={filters.employeeId}
          Type={filters.type}
        />
      )}

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={configFile.colorGreen} />
        </View>
      ) : (
        <FlatList
          data={attendance}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          onRefresh={fetchAttendance}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={{ color: '#888' }}>No attendance records found</Text>
            </View>
          }
        />
      )}

      {selectedItem && (
        <RecordModal
          showRecordModal={showRecordModal}
          setShowRecordModal={setShowRecordModal}
          item={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default AttendanceScreen;
