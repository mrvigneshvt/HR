import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Employee {
  employee_id: string;
  name: string;
  profile_image: string | null;
  designation: string;
  gender: 'Male' | 'Female';
}

interface EmployeeIdCardFrontProps {
  employee: Employee | null;
}

const EmployeeIdCardFront: React.FC<EmployeeIdCardFrontProps> = ({ employee }) => {
  if (!employee) return null;

  const getProfileImage = () => {
    if (employee.profile_image) return { uri: employee.profile_image };
    return employee.gender === 'Female'
      ? require('../assets/profile.png')
      : require('../assets/man.webp');
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={require('../assets/SDLOGO.png')} style={styles.logo} />
        <Text style={styles.companyName}>SDCE Facilities{"\n"}Management Pvt.Ltd</Text>
      </View>

      <View style={styles.photoContainer}>
        <View style={styles.photoBorder}>
          <Image source={getProfileImage()} style={styles.photo} />
        </View>
      </View>

      <View style={styles.curvedGreenBox}>
        <Text style={styles.name}>{employee.name.toUpperCase()}</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.designation}>{employee.designation}</Text>
        <Text style={styles.employeeId}>{employee.employee_id}</Text>
      </View>

      <View style={styles.footer}>
        <Image source={require('../assets/icon.png')} style={styles.webIcon} />
        <Text style={styles.website}>www.sdcefm.com</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 320,
    height: 500,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  header: {
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#006A4E',
    textAlign: 'center',
    marginTop: 5,
  },
  photoContainer: {
    marginTop: 12,
    marginBottom: 6,
  },
  photoBorder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: '#1E3269',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  curvedGreenBox: {
    backgroundColor: '#00A86B',
    width: '100%',
    height: 100,
    borderTopLeftRadius: 160,
    borderTopRightRadius: 160,
    marginTop: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  details: {
    marginTop: 10,
    alignItems: 'center',
  },
  designation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  employeeId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 10,
  },
  webIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
  },
  website: {
    fontSize: 14,
    color: '#00723F',
  },
});

export default EmployeeIdCardFront;
