import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { configFile } from 'config'; // for colorGreen
import { Colors } from 'class/Colors';

interface Props {
  item: {
    employee_id: string;
    employee_name: string;
    overall_status: string;
    attendance_date: string;
    client_no: string | null;
    company_name: string | null;
    check_in_time: string | null;
    lunch_in_time: string | null;
    check_out_time: string | null;
    title: string | null;
    notes: string | null;
  };
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

  const onPress = () => {
    setSelectedItem(item);
    setShowRecordModal(true);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Header: Name + Status */}
      <View style={styles.header}>
        <Text style={styles.name}>{item.employee_name || item.name}</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.overall_status) }]}>
          <Text style={styles.badgeText}>{item.overall_status}</Text>
        </View>
      </View>

      {/* Basic Info */}
      <Text style={styles.label}>
        ID: <Text style={styles.value}>{item.employee_id}</Text>
      </Text>
      <Text style={styles.label}>
        Date: <Text style={styles.value}>{item.attendance_date}</Text>
      </Text>
      {item.company_name ? (
        <Text style={styles.label}>
          Company: <Text style={styles.value}>{item.company_name}</Text>
        </Text>
      ) : null}
      {item.client_no ? (
        <Text style={styles.label}>
          Client No: <Text style={styles.value}>{item.client_no}</Text>
        </Text>
      ) : null}

      {/* Times */}
      {item.check_in_time ? (
        <Text style={styles.label}>
          Check‑In: <Text style={styles.value}>{item.check_in_time}</Text>
        </Text>
      ) : null}
      {item.lunch_in_time ? (
        <Text style={styles.label}>
          Lunch‑In: <Text style={styles.value}>{item.lunch_in_time}</Text>
        </Text>
      ) : null}
      {item.check_out_time ? (
        <Text style={styles.label}>
          Check‑Out: <Text style={styles.value}>{item.check_out_time}</Text>
        </Text>
      ) : null}

      {/* Optional title/notes */}
      {item.title ? (
        <Text style={styles.label}>
          Title: <Text style={styles.value}>{item.title}</Text>
        </Text>
      ) : null}
      {item.notes ? (
        <Text style={styles.label}>
          Notes: <Text style={styles.value}>{item.notes}</Text>
        </Text>
      ) : null}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: configFile.colorGreen,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  value: {
    color: '#000',
    fontWeight: '500',
  },
});
