import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface Employee {
  employee_id: string;
  name?: string;
  emergency_contact_phone: string;
  dob: string | null;
  address_house: string;
  address_street: string;
  address_district: string;
  address_state: string;
  address_zip: string;
  [key:string]: any;
}

interface Props {
  employee: Employee;
}

const DetailRow: React.FC<{ label: string; value: string | undefined | null }> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value} numberOfLines={2} ellipsizeMode="tail">{value || 'N/A'}</Text>
  </View>
);

const EmployeeIdCardDetail: React.FC<Props> = ({ employee }) => {
  const formattedAddress = [
    employee.address_house,
    employee.address_street,
    employee.address_district,
    employee.address_state,
  ]
    .filter(Boolean)
    .join(', ') + (employee.address_zip ? ` - ${employee.address_zip}` : '');

  const qrData = JSON.stringify({
    employeeId: employee.employee_id,
    name: employee.name,
    emergencyContact: employee.emergency_contact_phone,
  });

  return (
    <View style={styles.card}>
      {/* QR Code */}
      <View style={styles.qrContainer}>
        <QRCode value={qrData} size={120} />
      </View>

      {/* Details */}
      <View style={styles.detailsContainer}>
        <DetailRow label="Employee ID" value={employee.employee_id} />
        <DetailRow label="Name" value={employee.name} />
        <DetailRow label="Emergency Contact" value={employee.emergency_contact_phone} />
        <DetailRow 
          label="Date of Birth" 
          value={employee.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'} 
        />
        <DetailRow label="Address" value={formattedAddress} />
      </View>

      {/* Company Info */}
      <View style={styles.companyInfo}>
        <Text style={styles.companyName}>
          <Text style={styles.sdceText}>SDCE</Text> Facilities Management Pvt. Ltd
        </Text>
        <Text style={styles.address}>
          # 364, 2nd Floor, Anna Salai,{'\n'}
          Thousand Lights, Chennai - 600 006{'\n'}
          Tel: +91 44 4851 4869
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 320 / 500,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
  },
  qrContainer: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  detailsContainer: {
    width: '100%',
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#555',
    flex: 2,
    textAlign: 'right',
  },
  companyInfo: {
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    width: '100%',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sdceText: {
    color: '#228B22',
  },
  address: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});

export default EmployeeIdCardDetail; 