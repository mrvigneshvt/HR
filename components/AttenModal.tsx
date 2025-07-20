import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface RecordModalProps {
  showRecordModal: boolean;
  setShowRecordModal: (value: boolean) => void;
  item: {
    id: number;
    employee_id: string;
    client_no: string;
    attendance_date: string;
    check_in_time: string | null;
    check_in_status: string | null;
    check_in_fake: 1 | 0;
    lunch_in_time: string | null;
    lunch_in_status: string | null;
    lunch_in_fake: 1 | 0;

    check_out_time: string | null;
    check_out_status: string | null;
    check_out_fake: 1 | 0;

    overall_status: string;
    latitude: string;
    longitude: string;
    created_at: string;
    updated_at: string;
    employee_name: string | null;
    company_name: string;
  };
  setSelectedItem: React.Dispatch<React.SetStateAction<any>>;
}

const RecordModal: React.FC<RecordModalProps> = ({
  showRecordModal,
  setShowRecordModal,
  item,
  setSelectedItem,
}) => {
  if (!item) return null;

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const DetailRow = ({ label, value, fake }: { label: any; value: any; fake?: 1 | 0 }) => (
    <View className="flex-row items-center">
      <Text style={styles.label}>
        {label}: <Text style={styles.value}>{value || 'N/A'}</Text>
      </Text>
      {fake && <MaterialIcons name="location-off" size={15} color="red" />}
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showRecordModal}
      onRequestClose={() => {
        setShowRecordModal(false);
        setSelectedItem(null);
      }}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.heading}>Attendance Record</Text>

            <Section title="Employee Information">
              <DetailRow label="Employee ID" value={item.employee_id} />
              <DetailRow label="Employee Name" value={item.employee_name} />
            </Section>

            <Section title="Attendance Details">
              <DetailRow label="Date" value={item.attendance_date} />
              <DetailRow label="Check-In" value={item.check_in_time} fake={item.check_in_fake} />
              <DetailRow label="Lunch In" value={item.lunch_in_time} fake={item.lunch_in_fake} />
              <DetailRow label="Check-Out" value={item.check_out_time} fake={item.check_out_fake} />
              <DetailRow label="Status" value={item.overall_status} />
            </Section>

            <Section title="Client & Location">
              <DetailRow label="Company" value={item.company_name} />

              <DetailRow label="Client No" value={item.client_no} />
              <DetailRow label="Latitude" value={item.latitude} />
              <DetailRow label="Longitude" value={item.longitude} />
            </Section>

            <Section title="Meta">
              <DetailRow label="Created At" value={new Date(item.created_at).toLocaleString()} />
            </Section>
          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setShowRecordModal(false);
              setSelectedItem(null);
            }}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RecordModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '85%',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#222',
  },
  section: {
    marginBottom: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#444',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
    fontWeight: '600',
  },
  value: {
    fontWeight: 'normal',
    color: '#666',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
