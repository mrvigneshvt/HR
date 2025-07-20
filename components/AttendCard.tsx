import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import {} from 'config'; // Make sure Colors is imported correctly
import { configFile } from 'config'; // Assuming configFile has colorGreen

interface Props {
  item: any;
  showRecordModal: boolean;
  setShowRecordModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<any>>;
}

const AttendCard = ({ item, setShowRecordModal, setSelectedItem }: Props) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'green';
      case 'absent':
        return 'red';
      case 'leave':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: '#fff' }]}
      onPress={() => {
        setSelectedItem(item);
        setShowRecordModal(true);
      }}>
      <View style={styles.cardHeader}>
        <Text style={styles.employeeName}>{item.employee_name}</Text>
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor(item.overall_status) }]}>
          <Text style={styles.statusText}>{item.overall_status}</Text>
        </View>
      </View>
      <Text style={styles.textGray}>ID: {item.employee_id}</Text>
      <Text style={styles.textGray}>Date: {item.attendance_date}</Text>
      <Text style={styles.textGray}>Company: {item.company_name}</Text>
      <Text style={styles.textGray}>Client No: {item.client_no}</Text>
    </TouchableOpacity>
  );
};

export default AttendCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 14,
    borderRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  employeeName: { fontSize: 16, fontWeight: 'bold', color: configFile.colorGreen },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  statusText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  textGray: { color: '#555', marginBottom: 2 },
});
