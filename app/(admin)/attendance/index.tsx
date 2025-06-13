import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import SearchBar from '../../../components/search';
import FilterIcon from '../../../components/filterIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AdminCalendar from '../../../components/adminCalendar';
import { configFile } from 'config';

const AttendanceScreen = () => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => {
      const data = [
        { id: '1', employeeName: 'John Doe', date: '2024-06-01', status: 'Present' },
        { id: '2', employeeName: 'Jane Smith', date: '2024-06-01', status: 'Absent' },
      ];
      setAttendance(data);
      setFiltered(data);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    setFiltered(
      attendance.filter(item =>
        item.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        item.date.includes(search)
      )
    );
  }, [search, attendance]);

  const handleCalendarDayPress = (day: any) => {
    const selected = day.dateString;
    setSelectedDate(selected);
    setFiltered(
      attendance.filter((item) => item.date === selected)
    );
    setShowFilterModal(false);
  };

  if (loading) return <ActivityIndicator color="#4A90E2" size="large" style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Attendance',
          headerStyle: {
            backgroundColor: configFile.colorGreen,
          },
          headerTintColor: 'white',
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable onPress={() => setShowFilterModal(true)} style={{ marginRight: 16 }}>
                <MaterialIcons name="filter-list" size={24} color="white" />
              </Pressable>
            </View>
          ),
        }}
      />

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search employee or date..." />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ backgroundColor: '#fff', margin: 8, padding: 16, borderRadius: 8 }}
            onPress={() => setSelectedAttendance(item)}
          >
            <Text>{item.employeeName}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Detail Modal */}
      <Modal
        visible={!!selectedAttendance}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedAttendance(null)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            width: '100%',
            maxWidth: 400,
            padding: 24,
            elevation: 5,
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
              {selectedAttendance?.employeeName}
            </Text>
            <Text>Date: {selectedAttendance?.date}</Text>
            <Text>Status: {selectedAttendance?.status}</Text>

            <Text
              onPress={() => setSelectedAttendance(null)}
              style={{
                marginTop: 16,
                color: 'white',
                alignSelf: 'flex-end',
                backgroundColor: '#4A90E2',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 6,
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
    </View>
  );
};

export default AttendanceScreen;
