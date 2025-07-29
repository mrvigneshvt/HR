import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { configFile } from 'config';
import MapView, { Marker } from 'react-native-maps';

interface RecordModalProps {
  showRecordModal: boolean;
  setShowRecordModal: (value: boolean) => void;
  setSelectedItem: React.Dispatch<React.SetStateAction<any>>;
  item: {
    id: number;
    employee_id: string;
    employee_name: string | null;
    attendance_date: string;
    client_no: string | null;
    company_name: string | null;
    check_in_time: string | null;
    check_in_fake: 1 | 0;
    lunch_in_time: string | null;
    lunch_in_fake: 1 | 0;
    check_out_time: string | null;
    check_out_fake: 1 | 0;
    overall_status: string;
    latitude: string;
    longitude: string;
    created_at: string;
    title: string | null;
    notes: string | null;
  };
}

const RecordModal: React.FC<RecordModalProps> = ({
  showRecordModal,
  setShowRecordModal,
  item,
  setSelectedItem,
}) => {
  const [showMap, setShowMap] = useState(false);
  if (!item) return null;

  const close = () => {
    setShowRecordModal(false);
    setSelectedItem(null);
    setShowMap(false);
  };

  const Section: React.FC<{ title: string }> = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const DetailRow: React.FC<{
    label: string;
    value: string | null;
    fake?: 1 | 0;
  }> = ({ label, value, fake }) =>
    value ? (
      <View style={styles.row}>
        <Text style={styles.label}>
          {label}: <Text style={styles.value}>{value}</Text>
        </Text>
        {fake === 1 && (
          <MaterialIcons name="location-off" size={16} color="red" style={styles.fakeIcon} />
        )}
      </View>
    ) : null;

  const latitude = parseFloat(item.latitude);
  const longitude = parseFloat(item.longitude);
  const isLocationValid = !isNaN(latitude) && !isNaN(longitude);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) => console.error('Google Maps link error:', err));
  };

  return (
    <Modal visible={showRecordModal} animationType="slide" transparent onRequestClose={close}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.heading}>Attendance Record</Text>

            <Section title="Employee Info">
              <DetailRow label="Employee ID" value={item.employee_id} />
              <DetailRow label="Name" value={item.employee_name} />
            </Section>

            <Section title="Attendance">
              <DetailRow label="Date" value={item.attendance_date} />
              <DetailRow label="Check‑In" value={item.check_in_time} fake={item.check_in_fake} />
              <DetailRow label="Lunch‑In" value={item.lunch_in_time} fake={item.lunch_in_fake} />
              <DetailRow label="Check‑Out" value={item.check_out_time} fake={item.check_out_fake} />
              <DetailRow label="Status" value={item.overall_status} />
            </Section>

            <Section title="Client & Location">
              <DetailRow label="Company" value={item.company_name} />
              <DetailRow label="Client No" value={item.client_no} />
              <DetailRow label="Latitude" value={item.latitude} />
              <DetailRow label="Longitude" value={item.longitude} />

              {isLocationValid && (
                <View style={styles.mapActionRow}>
                  <TouchableOpacity onPress={() => setShowMap(!showMap)}>
                    <View style={styles.row}>
                      <MaterialIcons
                        name={showMap ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={20}
                        color="#444"
                      />
                      <Text style={[styles.label, { marginLeft: 4 }]}>
                        {showMap ? 'Hide Map' : 'Show Map'}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={openInGoogleMaps}>
                    <Text style={styles.mapLink}>View in Google Maps</Text>
                  </TouchableOpacity>
                </View>
              )}

              {showMap && isLocationValid && (
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    region={{
                      latitude,
                      longitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }}>
                    <Marker coordinate={{ latitude, longitude }} />
                  </MapView>
                </View>
              )}
            </Section>

            <Section title="Notes">
              <DetailRow label="Title" value={item.title} />
              <DetailRow label="Notes" value={item.notes} />
            </Section>

            <Section title="Meta">
              <DetailRow label="Created" value={new Date(item.created_at).toLocaleString()} />
            </Section>
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={close}>
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
    backgroundColor: '#00000099',
    justifyContent: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '85%',
  },
  scroll: {
    paddingBottom: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 12,
  },
  section: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  value: {
    fontWeight: '400',
    color: '#555',
  },
  fakeIcon: {
    marginLeft: 4,
  },
  mapActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  mapLink: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '500',
  },
  mapContainer: {
    height: 180,
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  closeBtn: {
    marginTop: 12,
    backgroundColor: configFile.colorGreen,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
