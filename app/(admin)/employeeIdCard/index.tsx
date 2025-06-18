import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, Text, Modal, Pressable, TextInput } from 'react-native';
import SearchBar from '../../../components/search';
import FilterIcon from '../../../components/filterIcons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { configFile } from 'config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AdminCalendar from '../../../components/adminCalendar'; // Import the calendar component
import EmployeeIdCardDetail from 'components/employeeIdCardDetails';
import { isReadOnlyRole } from 'utils/roleUtils';

const EmployeeIdCardScreen = ({ navigation }: { navigation: any }) => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false); // For the filter modal
  const [selectedDate, setSelectedDate] = useState<string>(''); // To store selected date
  const [newEmployee, setNewEmployee] = useState({ name: '', emergencyContact: '', idCardNumber: '' }); // New employee form state

  // NEW: State to hold selected employee and show detail modal
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const params = useLocalSearchParams();
  const role = params.role as string | undefined;
  const readOnly = isReadOnlyRole(role);
  console.log('EmployeeIdCardScreen readOnly:', readOnly, 'role:', role);

  useEffect(() => {
    setTimeout(() => {
      const data: any[] = [
        { id: '1', name: 'John Doe', emergencyContact: '1234567890', idCardNumber: 'ID001' },
        { id: '2', name: 'Jane Smith', emergencyContact: '9876543210', idCardNumber: 'ID002' },
        { id: '3', name: 'Alice Johnson', emergencyContact: '2345678901', idCardNumber: 'ID003' },
        { id: '4', name: 'Bob Brown', emergencyContact: '3456789012', idCardNumber: 'ID004' },
        { id: '5', name: 'Charlie White', emergencyContact: '4567890123', idCardNumber: 'ID005' },
        { id: '6', name: 'Daisy Green', emergencyContact: '5678901234', idCardNumber: 'ID006' },
        { id: '7', name: 'Edward Black', emergencyContact: '6789012345', idCardNumber: 'ID007' },
        { id: '8', name: 'Fiona Grey', emergencyContact: '7890123456', idCardNumber: 'ID008' },
        { id: '9', name: 'George Pink', emergencyContact: '8901234567', idCardNumber: 'ID009' },
        { id: '10', name: 'Helen Violet', emergencyContact: '9012345678', idCardNumber: 'ID010' },
        { id: '11', name: 'Ian Indigo', emergencyContact: '0123456789', idCardNumber: 'ID011' },
        { id: '12', name: 'Julia Cyan', emergencyContact: '1029384756', idCardNumber: 'ID012' },
      ];
      setEmployees(data);
      setFiltered(data);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    setFiltered(
      employees.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.idCardNumber.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, employees]);

  const handleCalendarDayPress = (day: any) => {
    setSelectedDate(day.dateString); // Update selected date
    setShowFilterModal(false); // Close modal after selection
  };

  const handleAddEmployee = () => {
    const { name, emergencyContact, idCardNumber } = newEmployee;
    if (name && emergencyContact && idCardNumber) {
      const newEmp = {
        id: (employees.length + 1).toString(),
        name,
        emergencyContact,
        idCardNumber,
      };
      setEmployees([...employees, newEmp]);
      setNewEmployee({ name: '', emergencyContact: '', idCardNumber: '' }); // Reset form
      setShowAddModal(false);
    } else {
      alert('Please fill all fields.');
    }
  };

  if (loading) return <ActivityIndicator color="#4A90E2" size="large" />;

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Employee ID Card',
          headerStyle: {
            backgroundColor: configFile.colorGreen,
          },
          headerTintColor: 'white',
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {!readOnly && (
                <Pressable onPress={() => setShowFilterModal(true)} style={{ marginRight: 16 }}>
                <MaterialIcons name="filter-list" size={24} color="white" />
              </Pressable>
              )}
              
              { !readOnly && (
                <Pressable onPress={() => setShowAddModal(true)}>
                  <MaterialIcons name="add" size={24} color="white" />
                </Pressable>
              )}
            </View>
          ),
        }}
      />

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search employee..." />

      <FlatList
        data={filtered}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ backgroundColor: '#fff', margin: 8, padding: 16, borderRadius: 8 }}
            onPress={() => setSelectedEmployee(item)} // Show detail modal on press
          >
            <Text>{item.name}</Text>
            <Text>{item.idCardNumber}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Employee Detail Modal */}
      <Modal
        visible={!!selectedEmployee}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedEmployee(null)}
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
            <EmployeeIdCardDetail employee={selectedEmployee} />

            <Text
              onPress={() => setSelectedEmployee(null)}
              style={{
                marginTop: 16,
                color: 'white',
                alignSelf: 'flex-end',
                backgroundColor: '#4A90E2',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 6,
                textAlign: 'center',
              }}
            >
              Close
            </Text>
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
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Select Date</Text>
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
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Add Employee Modal */}
      { !readOnly && (
        <Modal
          visible={showAddModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
            onPress={() => setShowAddModal(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Add Employee</Text>

              {/* Input Fields */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 4 }}>Name</Text>
                <TextInput
                  value={newEmployee.name}
                  onChangeText={(text) => setNewEmployee({ ...newEmployee, name: text })}
                  style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 }}
                  placeholder="Enter name"
                />
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 4 }}>Emergency Contact</Text>
                <TextInput
                  value={newEmployee.emergencyContact}
                  onChangeText={(text) => setNewEmployee({ ...newEmployee, emergencyContact: text })}
                  style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 }}
                  placeholder="Enter contact number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 4 }}>ID Card Number</Text>
                <TextInput
                  value={newEmployee.idCardNumber}
                  onChangeText={(text) => setNewEmployee({ ...newEmployee, idCardNumber: text })}
                  style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 }}
                  placeholder="Enter ID card number"
                />
              </View>

              {/* Actions */}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                <Pressable
                  onPress={() => setShowAddModal(false)}
                  style={{
                    borderColor: '#4A90E2',
                    borderWidth: 1,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 6,
                    marginRight: 12,
                  }}
                >
                  <Text style={{ color: '#4A90E2' }}>Cancel</Text>
                </Pressable>

                <Pressable
                  onPress={handleAddEmployee}
                  style={{
                    backgroundColor: '#4A90E2',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: 'white' }}>Add</Text>
                </Pressable>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

export default EmployeeIdCardScreen;
