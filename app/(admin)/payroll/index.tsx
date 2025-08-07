import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import SearchBar from '../../../components/search';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AdminCalendar from '../../../components/adminCalendar';
import { configFile } from '../../../config';
import { isReadOnlyRole } from '../../../utils/roleUtils';
import { BackHandler } from 'react-native';
import moment from 'moment';
import { NavRouter } from 'class/Router';

const PayslipDetail = ({ detail }: { detail: any }) => {
  if (!detail || !detail.payslips || detail.payslips.length === 0) {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          width: '100%',
          maxWidth: 400,
          padding: 24,
          elevation: 5,
          alignItems: 'center',
        }}>
        <Text>No payslip details available.</Text>
      </View>
    );
  }

  const payslip = detail.payslips[0];

  const renderRow = (label: string, value: string | number) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
      }}>
      <Text style={{ color: '#666' }}>{label}</Text>
      <Text style={{ fontWeight: 'bold' }}>{value}</Text>
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        width: '100%',
        maxWidth: 400,
        padding: 20,
        elevation: 5,
      }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
        Payslip for {moment(payslip.month).format('MMMM YYYY')}
      </Text>

      <View style={{ marginBottom: 16, alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{detail.name}</Text>
        <Text style={{ color: '#555' }}>{detail.designation}</Text>
        <Text style={{ color: '#555' }}>Employee ID: {detail.employee_id}</Text>
      </View>

      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' }}>
          Earnings
        </Text>
        {renderRow('Basic Salary', `₹${payslip.basic || payslip.basic_salary || '0.00'}`)}
        {renderRow('DA', `₹${payslip.da || '0.00'}`)}
        {renderRow('HRA', `₹${payslip.hra || '0.00'}`)}
        {payslip.spl_allowance && renderRow('Special Allowance', `₹${payslip.spl_allowance}`)}
        {payslip.leave_wages && renderRow('Leave Wages', `₹${payslip.leave_wages}`)}
        {payslip.bonus && renderRow('Bonus', `₹${payslip.bonus}`)}
        {payslip.ot_amount && renderRow('OT Amount', `₹${payslip.ot_amount}`)}
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' }}>
          Deductions
        </Text>
        {renderRow('EPF', `₹${payslip.epf || payslip.pf_deduction || '0.00'}`)}
        {renderRow('ESI', `₹${payslip.esi || payslip.esi_deduction || '0.00'}`)}
        {payslip.lwf && renderRow('LWF', `₹${payslip.lwf}`)}
      </View>

      <View style={{ borderTopWidth: 2, borderTopColor: '#333', paddingTop: 8 }}>
        {payslip.gross_salary && renderRow('Gross Salary', `₹${payslip.gross_salary}`)}
        {renderRow('Total Deductions', `₹${payslip.total_deduction || '0.00'}`)}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 8,
            marginTop: 8,
            backgroundColor: '#E6F7FF',
            paddingHorizontal: 10,
            borderRadius: 6,
          }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Net Salary (Take Home)</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            ₹{payslip.take_home || payslip.net_salary || '0.00'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const PayrollScreen = () => {
  const [loading, setLoading] = useState(true);
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filteredPayrolls, setFilteredPayrolls] = useState<any[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM'));
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [payslipDetail, setPayslipDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const params = useLocalSearchParams();
  const role = params.role as string | undefined;
  const empId = params.empId as string | undefined;
  const readOnly = isReadOnlyRole(role);

  const fetchPayrolls = React.useCallback(async (month: string) => {
    setLoading(true);
    setPayrolls([]);
    setFilteredPayrolls([]);
    try {
      const response = await fetch(
        configFile.api.superAdmin.getPayslipByMonth(month)
        //`https://sdceweb.lyzooapp.co.in:31313/api/payroll/payslips/?month=${month}`
      );
      const result = await response.json();
      if (result.success) {
        setPayrolls(result.data.payslips);
        setFilteredPayrolls(result.data.payslips);
      } else {
        Alert.alert('Error', result.message || 'Failed to fetch payslips.');
      }
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      Alert.alert('Error', 'An unexpected error occurred while fetching payslips.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayrolls(selectedDate);
  }, [fetchPayrolls, selectedDate]);

  useEffect(() => {
    setFilteredPayrolls(
      payrolls.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, payrolls]);

  const handleCalendarDayPress = (day: any) => {
    setSelectedDate(moment(day.dateString).format('YYYY-MM'));
    setShowFilterModal(false);
  };

  const fetchEmployeePayslip = async (employeeId: string) => {
    if (!employeeId) return;
    setDetailLoading(true);
    setPayslipDetail(null);
    try {
      const response = await fetch(
        configFile.api.superAdmin.getPayrollByIdandMonth(employeeId,selectedDate)
        //mohinth `https://sdce.lyzooapp.co.in:31313/api/payroll/employees/${employeeId}?month=${selectedDate}`
      );
      const result = await response.json();
      if (result.success) {
        setPayslipDetail(result.data);
      } else {
        Alert.alert('Error', result.message || 'Failed to fetch payslip details.');
      }
    } catch (error) {
      console.error('Error fetching employee payslip:', error);
      Alert.alert('Error', 'An unexpected error occurred while fetching payslip details.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleEmployeePress = (item: any) => {
    setSelectedEmployee(item);
    fetchEmployeePayslip(item.employee_id);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setPayslipDetail(null);
  };

  useEffect(() => {
    // const onBackPress = () => {
    //   router.replace({
    //     pathname: '/(admin)/home',
    //     params: { role, empId },
    //   });
    //   return true;
    // };
    // BackHandler.addEventListener('hardwareBackPress', onBackPress);
    // return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    NavRouter.BackHandler({ empId, role });
  }, [role, empId]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Payroll - ${moment(selectedDate).format('MMM YYYY')}`,
          headerStyle: { backgroundColor: configFile.colorGreen },
          headerTintColor: 'white',
          headerRight: () => (
            <Pressable onPress={() => setShowFilterModal(true)} style={{ marginRight: 16 }}>
              <MaterialIcons name="filter-list" size={24} color="white" />
            </Pressable>
          ),
        }}
      />

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search employee..." />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} color="#4A90E2" size="large" />
      ) : (
        <FlatList
          data={filteredPayrolls}
          keyExtractor={(item) => item.employee_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                marginHorizontal: 8,
                marginTop: 8,
                padding: 16,
                borderRadius: 8,
                elevation: 2,
              }}
              onPress={() => handleEmployeePress(item)}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ color: '#666', marginBottom: 8 }}>ID: {item.employee_id}</Text>
              <Text style={{ fontSize: 16, color: '#007BFF', fontWeight: '500' }}>
                Take Home: ₹{item.take_home}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 30, fontSize: 16 }}>
              No payslips found for {moment(selectedDate).format('MMMM YYYY')}.
            </Text>
          }
        />
      )}

      {/* Payroll Detail Modal */}
      <Modal
        visible={!!selectedEmployee}
        transparent
        animationType="fade"
        onRequestClose={closeModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
          {detailLoading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <>
              <PayslipDetail detail={payslipDetail} />
              {payslipDetail && (
                <View style={{ width: '100%', maxWidth: 400, marginTop: 10 }}>
                  <Pressable
                    onPress={() => {
                      // Add download logic here
                      alert('Download initiated');
                    }}
                    style={{
                      backgroundColor: '#4A90E2',
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 6,
                      marginTop: 8,
                    }}>
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                      Download PDF
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={closeModal}
                    style={{
                      marginTop: 10,
                      backgroundColor: '#fff',
                      paddingVertical: 12,
                      borderRadius: 6,
                    }}>
                    <Text style={{ color: '#4A90E2', textAlign: 'center', fontWeight: 'bold' }}>
                      Close
                    </Text>
                  </Pressable>
                </View>
              )}
            </>
          )}
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => setShowFilterModal(false)}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Select Month</Text>

            <AdminCalendar
              onDayPress={handleCalendarDayPress}
              markedDates={{
                [moment(selectedDate).format('YYYY-MM-DD')]: {
                  selected: true,
                  selectedColor: '#4A90E2',
                },
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PayrollScreen;
