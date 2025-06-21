import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface Employee {
  name?: string;
  emergencyContact: string;
  [key: string]: any;
}

interface Props {
  employee: Employee;
}

const EmployeeIdCardDetail: React.FC<Props> = ({ employee }) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <Text style={styles.title}>Employee Details</Text>

      {/* QR Code */}
      <View style={styles.qrContainer}>
        <QRCode
          value={JSON.stringify({
            name: employee.name,
            emergencyContact: employee.emergencyContact,
          })}
          size={200}
        />
      </View>

      {/* Name (if exists) */}
      {employee.name && (
        <Text style={styles.name}>Name: {employee.name}</Text>
      )}

      {/* Emergency Contact */}
      <Text style={styles.label}>Emergency Contact:</Text>
      <Text style={styles.value}>{employee.emergencyContact}</Text>

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
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    padding: 24,
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  qrContainer: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  companyInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sdceText: {
    color: '#228B22',
  },
  address: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
  },
});

export default EmployeeIdCardDetail;