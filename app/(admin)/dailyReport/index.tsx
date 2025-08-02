import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { configFile } from 'config';
import CompanySwitch from 'components/CompanySwitch';
import { company } from 'Memory/Token';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DailyReportModal from 'components/DailyReportModal';
import PaginatedComponent from 'components/Pagination';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from 'class/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useIsFocused } from '@react-navigation/native';
import { NavRouter } from 'class/Router';

interface Report {
  id: number;
  employee_id: string;
  date: string;
  work_summary: string;
  created_at?: string;
  name?: string;
  reportingId?: string;
  employee_name: string;
}

const Index = () => {
  const isFocus = useIsFocused();

  const params = useLocalSearchParams();

  const { empId, role, company } = params;

  console.log(params);
  const [Company, setCompany] = useState<company>(company || 'sdce');
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    setShowModal(false);
    setRefreshKey((prev) => prev + 1);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // yyyy-mm-dd
  };

  useEffect(() => {
    setCompany(company || 'sdce');
    NavRouter.BackHandler({ empId, company, role });
  }, [isFocus]);

  const getApiUrl = useCallback(() => {
    const baseUrl = configFile.api.superAdmin.reports;
    //'https://sdce.lyzooapp.co.in:31313/api/reports/get';   
    const prefixParam = Company === 'sdce' ? '' : `prefix=${Company}`;
    const dateParam = selectedDate ? `date=${formatDate(selectedDate)}` : '';
    const queryParams = [prefixParam, dateParam].filter(Boolean).join('&');
    return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
  }, [Company, selectedDate]);

  const onDateChange = (_: any, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setRefreshKey((prev) => prev + 1);
    }
  };

  const renderCard = ({ item }: { item: Report }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.employee_name}</Text>

      <View style={styles.row}>
        <FontAwesome name="id-badge" size={18} color={configFile.colorGreen} />
        <Text style={styles.meta}>{item.employee_id}</Text>
      </View>

      <View style={styles.row}>
        <MaterialIcons name="date-range" size={18} color={configFile.colorGreen} />
        <Text style={styles.meta}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summary}>{item.work_summary}</Text>
      </View>
    </View>
  );

  const HeaderRight = () => (
    <View style={styles.headerRight}>
      <TouchableOpacity onPress={() => setShowModal(true)}>
        <MaterialCommunityIcons name="pencil-plus-outline" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <MaterialIcons name="date-range" size={24} color="white" />
      </TouchableOpacity>

      {/* <CompanySwitch company={Company} setCompany={setCompany} /> */}
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Daily Report',
          headerStyle: {
            backgroundColor: configFile.colorGreen,
            elevation: 10,
          },
          headerTintColor: 'white',
          headerTitleStyle: { fontSize: 22, fontWeight: 'bold' },
          headerRight: HeaderRight,
        }}
      />

      <View style={[styles.container, { backgroundColor: Colors.get(Company, 'bg') }]}>
        <PaginatedComponent
          key={`${Company}-${refreshKey}`}
          url={getApiUrl()}
          limit={8}
          renderItem={renderCard}
          containerStyle={{ flex: 1 }}
        />

        {showModal && (
          <DailyReportModal
            showModal={showModal}
            setShowModal={setShowModal}
            empId={empId}
            onSave={handleSave}
          />
        )}

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>
    </>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: configFile.colorGreen,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  meta: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  summaryBox: {
    backgroundColor: '#f0f8f5',
    padding: 10,
    marginTop: 8,
    borderRadius: 8,
  },
  summary: {
    fontSize: 15,
    color: '#333',
    fontStyle: 'italic',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
    marginRight: 8,
    alignItems: 'center',
  },
});
