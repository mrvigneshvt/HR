import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { BackHandler } from 'react-native';
import SearchBar from '../../../components/search';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AdminCalendar from '../../../components/adminCalendar';
import { configFile } from 'config';
import axios from 'axios';
import { isReadOnlyRole } from 'utils/roleUtils';

interface AttendanceData {
  id: number;
  employee_id: string;
  client_no: string;
  attendance_date: string;
  check_in_time: string | null;
  check_in_status: string | null;
  lunch_in_time: string | null;
  lunch_in_status: string | null;
  check_out_time: string | null;
  check_out_status: string | null;
  overall_status: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  employee_name: string;
  company_name: string;
}

interface AttendanceResponse {
  data: AttendanceData[];
  summary: {
    totalRecords: number;
    statusBreakdown: Record<string, number>;
    dateRange: string | null;
    employeeFilter: string | null;
  };
  filters: {
    employeeId: string | null;
    dateRange: string | null;
    status: string | null;
  };
}

const BASE_URL = 'https://sdce.lyzooapp.co.in:31313/api';

const AttendanceScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<AttendanceData[]>([]);
  const [filtered, setFiltered] = useState<AttendanceData[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceData | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailedAttendance, setDetailedAttendance] = useState<AttendanceData | null>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceResponse['summary'] | null>(null);
  const params = useLocalSearchParams();
  const role = params.role as string | undefined;
  const empId = params.empId as string | undefined;
  const readOnly = isReadOnlyRole(role);
  console.log('AttendanceScreen readOnly:', readOnly, 'role:', role);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<AttendanceResponse>(`${BASE_URL}/attendance/getAttendanceDetails`);
      setAttendance(response.data.data);
      setFiltered(response.data.data);
    } catch (err) {
      setError('Failed to fetch attendance data');
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceDetails = async (employeeId: string, date?: string) => {
    try {
      setLoadingDetails(true);
      const params: Record<string, string> = { employeeId };
      if (date) {
        params.date = date;
      }
      
      const response = await axios.get<AttendanceResponse>(`${BASE_URL}/attendance/getAttendanceDetails`, {
        params
      });
      
      if (response.data.data.length > 0) {
        setDetailedAttendance(response.data.data[0]);
        setAttendanceSummary(response.data.summary);
      } else {
        setDetailedAttendance(null);
        setAttendanceSummary(null);
      }
    } catch (err) {
      console.error('Error fetching attendance details:', err);
      setDetailedAttendance(null);
      setAttendanceSummary(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  useEffect(() => {
    setFiltered(
      attendance.filter(item =>
        item.employee_name.toLowerCase().includes(search.toLowerCase()) ||
        item.employee_id.toLowerCase().includes(search.toLowerCase()) ||
        item.attendance_date.includes(search)
      )
    );
  }, [search, attendance]);

  const handleCalendarDayPress = (day: any) => {
    const selected = day.dateString;
    setSelectedDate(selected);
    setFiltered(
      attendance.filter((item) => item.attendance_date === selected)
    );
    setShowFilterModal(false);
  };

  const handleCardPress = async (item: AttendanceData) => {
    setSelectedAttendance(item);
    await fetchAttendanceDetails(item.employee_id, item.attendance_date);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return '#4CAF50';
      case 'absent':
        return '#F44336';
      case 'late':
        return '#FFC107';
      default:
        return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={configFile.colorGreen} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAttendance}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  useEffect(() => {
    const onBackPress = () => {
      router.replace({
        pathname: '/home',
        params: { role, empId },
      });
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Attendance',
          headerStyle: {
            backgroundColor: configFile.colorGreen,
          },
          headerTintColor: 'white',
          headerRight: () => (
            <View style={styles.headerRight}>
              {
                readOnly &&
              <Pressable onPress={() => setShowFilterModal(true)} style={styles.filterButton}>
                <MaterialIcons name="filter-list" size={24} color="white" />
              </Pressable>
              }
            </View>
          ),
        }}
      />

      <SearchBar 
        value={search} 
        onChangeText={setSearch} 
        placeholder="Search by name, ID or date..." 
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCardPress(item)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.employeeName}>{item.employee_name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.overall_status) }]}>
                <Text style={styles.statusText}>{item.overall_status}</Text>
              </View>
            </View>
            <Text style={styles.employeeId}>ID: {item.employee_id}</Text>
            <Text style={styles.date}>Date: {item.attendance_date}</Text>
            <Text style={styles.company}>Company: {item.company_name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Detail Modal */}
      <Modal
        visible={!!selectedAttendance}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setSelectedAttendance(null);
          setDetailedAttendance(null);
          setAttendanceSummary(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {loadingDetails ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={configFile.colorGreen} size="large" />
                <Text style={styles.loadingText}>Loading details...</Text>
              </View>
            ) : detailedAttendance ? (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{detailedAttendance.employee_name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(detailedAttendance.overall_status) }]}>
                    <Text style={styles.statusText}>{detailedAttendance.overall_status}</Text>
                  </View>
                </View>

                <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Employee Information</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Employee ID:</Text>
                      <Text style={styles.detailValue}>{detailedAttendance.employee_id}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Company:</Text>
                      <Text style={styles.detailValue}>{detailedAttendance.company_name}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Client No:</Text>
                      <Text style={styles.detailValue}>{detailedAttendance.client_no}</Text>
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Attendance Details</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Date:</Text>
                      <Text style={styles.detailValue}>{detailedAttendance.attendance_date}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Check-in:</Text>
                      <Text style={styles.detailValue}>{detailedAttendance.check_in_time || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Lunch:</Text>
                      <Text style={styles.detailValue}>{detailedAttendance.lunch_in_time || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Check-out:</Text>
                      <Text style={styles.detailValue}>{detailedAttendance.check_out_time || 'N/A'}</Text>
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Location</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Latitude:</Text>
                      <Text style={styles.detailValue}>{detailedAttendance.latitude}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Longitude:</Text>
                      <Text style={styles.detailValue}>{detailedAttendance.longitude}</Text>
                    </View>
                  </View>

                  {attendanceSummary && (
                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Summary</Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Total Records:</Text>
                        <Text style={styles.detailValue}>{attendanceSummary.totalRecords}</Text>
                      </View>
                      {Object.entries(attendanceSummary.statusBreakdown).map(([status, count]) => (
                        <View key={status} style={styles.detailRow}>
                          <Text style={styles.detailLabel}>{status.charAt(0).toUpperCase() + status.slice(1)}:</Text>
                          <Text style={styles.detailValue}>{count}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Timestamps</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Created:</Text>
                      <Text style={styles.detailValue}>{new Date(detailedAttendance.created_at).toLocaleString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Updated:</Text>
                      <Text style={styles.detailValue}>{new Date(detailedAttendance.updated_at).toLocaleString()}</Text>
                    </View>
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setSelectedAttendance(null);
                    setDetailedAttendance(null);
                    setAttendanceSummary(null);
                  }}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.errorText}>No detailed information available</Text>
            )}
          </View>
        </View>
      </Modal>

      {/* Filter Modal with Calendar */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity
          style={styles.filterModalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.filterModalContent}>
              <Text style={styles.filterTitle}>Select Date</Text>
              <AdminCalendar
                onDayPress={handleCalendarDayPress}
                markedDates={{ [selectedDate]: { selected: true, selectedColor: configFile.colorGreen } }}
              />
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    marginRight: 16,
  },
  card: {
    backgroundColor: '#fff',
    margin: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  employeeId: {
    color: '#666',
    marginBottom: 4,
  },
  date: {
    color: '#666',
    marginBottom: 4,
  },
  company: {
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalScrollView: {
    padding: 16,
  },
  modalSection: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#666',
    flex: 1,
  },
  detailValue: {
    color: '#333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: configFile.colorGreen,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  filterModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  filterModalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  filterTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
  },
  applyButton: {
    backgroundColor: configFile.colorGreen,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  errorText: {
    color: '#F44336',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: configFile.colorGreen,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
});

export default AttendanceScreen; 