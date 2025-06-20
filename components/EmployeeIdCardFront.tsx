// import React from 'react';
// import { View, Text, Image, StyleSheet } from 'react-native';

// interface Employee {
//   employee_id: string;
//   name: string;
//   profile_image: string | null;
//   designation: string;
//   gender: 'Male' | 'Female';
// }

// interface EmployeeIdCardFrontProps {
//   employee: Employee | null;
// }

// const EmployeeIdCardFront: React.FC<EmployeeIdCardFrontProps> = ({ employee }) => {
//   if (!employee) {
//     return null;
//   }

//   const getProfileImage = () => {
//     if (employee.profile_image) {
//       return { uri: employee.profile_image };
//     }
//     return employee.gender === 'Female'
//       ? require('../assets/profile.png') // Fallback for Female
//       : require('../assets/man.webp');    // Fallback for Male
//   };

//   return (
//     <View style={styles.card}>
//       <View style={styles.header}>
//         <Image source={require('../assets/SDLOGO.png')} style={styles.logo} />
//         <Text style={styles.companyName}>SDCE Facilities{"\n"}Management Pvt.Ltd</Text>
//       </View>

//       <View style={styles.photoSection}>
//         <View style={styles.photoRing}>
//           <Image source={getProfileImage()} style={styles.photo} />
//         </View>
//       </View>
      
//       <View style={styles.greenWaveContainer}>
//         <View style={styles.greenWave}>
//           <Text style={styles.name}>{employee.name}</Text>
//         </View>
//       </View>
      
//       <View style={styles.detailsSection}>
//         <Text style={styles.designation}>{employee.designation}</Text>
//         <Text style={styles.employeeId}>{employee.employee_id}</Text>
//       </View>

//       <View style={styles.footer}>
//         <Image source={require('../assets/icon.png')} style={styles.webIcon} />
//         <Text style={styles.website}>www.sdcefm.com</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     width: '100%',
//     aspectRatio: 320 / 500,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     overflow: 'hidden',
//     alignItems: 'center',
//     fontFamily: 'sans-serif',
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//   },
//   header: {
//     alignItems: 'center',
//     paddingTop: 20,
//   },
//   logo: {
//     width: 60,
//     height: 60,
//     resizeMode: 'contain',
//   },
//   companyName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#006A4E',
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   photoSection: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   photoRing: {
//     width: 140,
//     height: 140,
//     borderRadius: 70,
//     backgroundColor: '#fff',
//     padding: 5,
//     borderWidth: 5,
//     borderColor: '#003366', // Dark blue
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   photo: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//   },
//   greenWaveContainer: {
//     width: '100%',
//     height: 100,
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   greenWave: {
//     backgroundColor: '#2E8B57', // SeaGreen
//     width: '150%',
//     height: 200,
//     borderTopLeftRadius: 150,
//     borderTopRightRadius: 150,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     paddingBottom: 20,
//   },
//   name: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#000',
//     marginTop: 10,
//     fontFamily: 'serif',
//   },
//   detailsSection: {
//     alignItems: 'center',
//     marginTop: 15,
//   },
//   designation: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     fontFamily: 'serif',
//   },
//   employeeId: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#555',
//     marginTop: 5,
//   },
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 'auto',
//     paddingBottom: 20,
//   },
//   webIcon: {
//     width: 20,
//     height: 20,
//     marginRight: 8,
//   },
//   website: {
//     fontSize: 14,
//     color: '#006A4E',
//   },
// });

// export default EmployeeIdCardFront; 

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
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/SDLOGO.png')} style={styles.logo} />
        <Text style={styles.companyName}>SDCE Facilities{"\n"}Management Pvt.Ltd</Text>
      </View>

      {/* Profile Image */}
      <View style={styles.photoWrapper}>
        <View style={styles.photoRing}>
          <Image source={getProfileImage()} style={styles.photo} />
        </View>
      </View>

      {/* Name Wave Banner */}
      <View style={styles.waveContainer}>
        <View style={styles.wave} />
        <Text style={styles.name}>{employee.name.toUpperCase()}</Text>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <Text style={styles.designation}>{employee.designation}</Text>
        <Text style={styles.employeeId}>{employee.employee_id}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Image source={require('../assets/icon.png')} style={styles.webIcon} />
        <Text style={styles.website}>www.sdcefm.com</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 480,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  companyName: {
    color: '#00723F',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  photoWrapper: {
    alignItems: 'center',
    marginTop: 10,
  },
  photoRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 5,
    borderColor: '#1c2c52',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  waveContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: -10,
  },
  wave: {
    width: 340,
    height: 120,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
    backgroundColor: '#00A86B',
    position: 'absolute',
    top: 0,
    zIndex: -1,
  },
  name: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 50,
  },
  details: {
    alignItems: 'center',
    marginTop: 20,
  },
  designation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  employeeId: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 10,
  },
  webIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  website: {
    fontSize: 13,
    color: '#00723F',
  },
});

export default EmployeeIdCardFront;
