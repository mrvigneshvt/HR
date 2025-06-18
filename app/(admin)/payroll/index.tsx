import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import SearchBar from '../../../components/search';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AdminCalendar from '../../../components/adminCalendar';
import { configFile } from 'config';
import { isReadOnlyRole } from 'utils/roleUtils';
import { BackHandler } from 'react-native';
import { router } from 'expo-router';

const PayrollScreen = () => {
  const [loading, setLoading] = useState(true);
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<any[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);

  const params = useLocalSearchParams();
  const role = params.role as string | undefined;
  const empId = params.empId as string | undefined;
  const readOnly = isReadOnlyRole(role);
  console.log('PayrollScreen readOnly:', readOnly, 'role:', role);

  useEffect(() => {
    setTimeout(() => {
      const data: any[] = [
        { id: '1', employeeName: 'John Doe', month: 'June', amount: 5000 },
        { id: '2', employeeName: 'Jane Smith', month: 'June', amount: 6000 },
        { id: '3', employeeName: 'Alice Johnson', month: 'June', amount: 5500 },
        { id: '4', employeeName: 'Bob Brown', month: 'June', amount: 6200 },
        { id: '5', employeeName: 'Charlie White', month: 'June', amount: 5100 },
        { id: '6', employeeName: 'Daisy Green', month: 'June', amount: 5900 },
        { id: '7', employeeName: 'Edward Black', month: 'June', amount: 5300 },
        { id: '8', employeeName: 'Fiona Grey', month: 'June', amount: 6100 },
        { id: '9', employeeName: 'George Pink', month: 'June', amount: 5200 },
        { id: '10', employeeName: 'Helen Violet', month: 'June', amount: 6400 },
      ];
      setPayrolls(data);
      setFiltered(data);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    setFiltered(
      payrolls.filter(item =>
        item.employeeName.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, payrolls]);

  const handleCalendarDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    setShowFilterModal(false);
  };

  if (loading) return <ActivityIndicator color="#4A90E2" size="large" />;

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
    <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Payroll',
          headerStyle: { backgroundColor: configFile.colorGreen },
          headerTintColor: 'white',
          headerRight: () => (
            !readOnly && (
              <Pressable onPress={() => setShowFilterModal(true)} style={{ marginRight: 16 }}>
                <MaterialIcons name="filter-list" size={24} color="white" />
              </Pressable>
            )
          ),
        }}
      />

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search employee..." />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ backgroundColor: '#fff', margin: 8, padding: 16, borderRadius: 8 }}
            onPress={() => setSelectedPayroll(item)}
          >
            <Text>{item.employeeName} - {item.month}</Text>
            <Text>₹{item.amount}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Payroll Detail Modal */}
      <Modal
        visible={!!selectedPayroll}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPayroll(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              width: '100%',
              maxWidth: 400,
              padding: 24,
              elevation: 5,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Payroll Details</Text>
            <Text style={{ marginVertical: 4 }}>Name: {selectedPayroll?.employeeName}</Text>
            <Text style={{ marginVertical: 4 }}>Month: {selectedPayroll?.month}</Text>
            <Text style={{ marginVertical: 4 }}>Amount: ₹{selectedPayroll?.amount}</Text>

            <Pressable
              onPress={() => {
                // Add download logic here
                alert('Download initiated');
              }}
              style={{
                backgroundColor: '#4A90E2',
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 6,
                marginTop: 16,
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Download PDF</Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedPayroll(null)}
              style={{
                marginTop: 12,
                alignSelf: 'flex-end',
              }}
            >
              <Text style={{ color: '#4A90E2' }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => setShowFilterModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Select Date</Text>

            <AdminCalendar
              onDayPress={handleCalendarDayPress}
              markedDates={{ [selectedDate]: { selected: true, selectedColor: '#4A90E2' } }}
            />

            <Pressable
              onPress={() => setShowFilterModal(false)}
              style={{
                backgroundColor: '#4A90E2',
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
                marginTop: 16,
              }}
            >
              <Text style={{ color: 'white' }}>Apply Filter</Text>
            </Pressable>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PayrollScreen;
