import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Modal, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { configFile } from '../../../config';
import SearchBar from '../../../components/search';

const EmployeesScreen = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', location: '', id: '' });

  useEffect(() => {
    const data = [
      { id: 'EMP001', name: 'John Doe', location: 'Chennai' },
      { id: 'EMP002', name: 'Jane Smith', location: 'Bangalore' },
      { id: 'EMP003', name: 'Alice Johnson', location: 'Mumbai' },
      { id: 'EMP004', name: 'Bob Brown', location: 'Hyderabad' },
    ];
    setEmployeeList(data);
    setFilteredList(data);
  }, []);

  useEffect(() => {
    setFilteredList(
      employeeList.filter(emp =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.id.toLowerCase().includes(search.toLowerCase()) ||
        emp.location.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, employeeList]);

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.location && newEmployee.id) {
      setEmployeeList([...employeeList, newEmployee]);
      setNewEmployee({ name: '', location: '', id: '' });
      setShowAddModal(false);
    } else {
      alert('Please fill all fields.');
    }
  };

  const handleDeleteEmployee = () => {
    setEmployeeList(employeeList.filter(emp => emp.id !== selectedEmployee.id));
    setShowDeleteModal(false);
    setSelectedEmployee(null);
  };

  const renderEmployeeCard = ({ item }: { item: any }) => (
    <View
      key={item.id}
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
        <Text style={{ color: 'gray' }}>ID: {item.id}</Text>
        <Text style={{ color: 'gray' }}>Location: {item.location}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable onPress={() => { setSelectedEmployee(item); setShowEditModal(true); }}>
          <MaterialIcons name="edit" size={20} color="#4A90E2" />
        </Pressable>
        <Pressable onPress={() => { setSelectedEmployee(item); setShowDeleteModal(true); }}>
          <MaterialIcons name="delete" size={20} color="#FF6B6B" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Employees',
          headerStyle: {
            backgroundColor: configFile.colorGreen,
          },
          headerTintColor: 'white',
          headerRight: () => (
            <Pressable onPress={() => setShowAddModal(true)} style={{ marginRight: 16 }}>
              <MaterialIcons name="add" size={24} color="white" />
            </Pressable>
          ),
        }}
      />

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search employee..." />

      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        renderItem={renderEmployeeCard}
        contentContainerStyle={{ paddingVertical: 8 }}
      />

      {/* Add Modal */}
      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => setShowAddModal(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Add Employee</Text>

              <Text>Name</Text>
              <TextInput
                value={newEmployee.name}
                onChangeText={(text) => setNewEmployee({ ...newEmployee, name: text })}
                placeholder="Enter name"
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 12 }}
              />

              <Text>ID</Text>
              <TextInput
                value={newEmployee.id}
                onChangeText={(text) => setNewEmployee({ ...newEmployee, id: text })}
                placeholder="Enter ID"
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 12 }}
              />

              <Text>Location</Text>
              <TextInput
                value={newEmployee.location}
                onChangeText={(text) => setNewEmployee({ ...newEmployee, location: text })}
                placeholder="Enter location"
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 }}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                <Pressable
                  onPress={() => setShowAddModal(false)}
                  style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, marginRight: 8, borderWidth: 1, borderColor: '#4A90E2' }}
                >
                  <Text style={{ color: '#4A90E2' }}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleAddEmployee}
                  style={{ backgroundColor: '#4A90E2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 }}
                >
                  <Text style={{ color: 'white' }}>Add</Text>
                </Pressable>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={showEditModal} transparent animationType="slide" onRequestClose={() => setShowEditModal(false)}>
        <TouchableOpacity activeOpacity={1} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setShowEditModal(false)}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Edit Employee</Text>

              <TextInput
                placeholder="Name"
                value={selectedEmployee?.name}
                onChangeText={(text) => setSelectedEmployee({ ...selectedEmployee, name: text })}
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 12 }}
              />
              <TextInput
                placeholder="Location"
                value={selectedEmployee?.location}
                onChangeText={(text) => setSelectedEmployee({ ...selectedEmployee, location: text })}
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 }}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                <Pressable onPress={() => setShowEditModal(false)} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, marginRight: 8, borderWidth: 1, borderColor: '#4A90E2' }}>
                  <Text style={{ color: '#4A90E2' }}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    const updated = employeeList.map(emp => emp.id === selectedEmployee.id ? selectedEmployee : emp);
                    setEmployeeList(updated);
                    setShowEditModal(false);
                  }}
                  style={{ backgroundColor: '#4A90E2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 }}
                >
                  <Text style={{ color: 'white' }}>Save</Text>
                </Pressable>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Delete Modal */}
      <Modal visible={showDeleteModal} transparent animationType="slide" onRequestClose={() => setShowDeleteModal(false)}>
        <TouchableOpacity activeOpacity={1} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setShowDeleteModal(false)}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Delete Employee</Text>
              <Text style={{ marginBottom: 12 }}>Are you sure you want to delete {selectedEmployee?.name}?</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Pressable onPress={() => setShowDeleteModal(false)} style={{ marginRight: 12, borderWidth: 1, borderColor: '#FF6B6B', padding: 10, borderRadius: 6 }}>
                  <Text style={{ color: '#FF6B6B' }}>Cancel</Text>
                </Pressable>
                <Pressable onPress={handleDeleteEmployee} style={{ backgroundColor: '#FF6B6B', padding: 10, borderRadius: 6 }}>
                  <Text style={{ color: 'white' }}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default EmployeesScreen;
