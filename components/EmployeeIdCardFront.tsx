import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ImageBackground } from 'react-native';

const { width } = Dimensions.get('window');

const EmployeeIdCard = ({ employee }: { employee: any }) => {
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
                <Image source={require('../assets/sdce-logo.JPG')} style={styles.logo} />
                <Text style={styles.companyText}>
                    SDCE Facilities{"\n"}Management Pvt.Ltd
                </Text>
            </View>

            {/* Profile Section */}
            <View style={styles.photoContainer}>
                <View style={styles.photoBorder}>
                    <Image source={getProfileImage()} style={styles.photo} />
                </View>
            </View>

            {/* Curve and Name */}
            <ImageBackground source={require('../assets/curve.png')} style={styles.curveImageContainer} resizeMode="cover">
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{employee?.name}</Text>
                </View>
            </ImageBackground>


            {/* Details */}
            <View style={styles.detailsSection}>
                <Text style={styles.designation}>{employee.designation}</Text>
                <Text style={styles.empId}>{employee.employee_id}</Text>
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
        width: '100%',
        aspectRatio: 320 / 500,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        paddingVertical: 20,
        overflow: 'hidden',
    },
    header: {
        alignItems: 'center',
    },
    logo: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    companyText: {
        color: '#00723F',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 5,
    },
    photoContainer: {
        marginTop: 20,
        alignItems: 'center',
        zIndex: 1,
    },
    photoBorder: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 5,
        borderColor: '#0C204B',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    photo: {
        width: '90%',
        height: '90%',
        borderRadius: 60,
    },
    curveImageContainer: {
        width: '100%',
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -30,
    },
    textContainer: {
        alignItems: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },


    detailsSection: {
        alignItems: 'center',
        marginTop: 20,
    },
    designation: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    empId: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
        marginTop: 5,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
    },
    webIcon: {
        width: 20,
        height: 20,
        marginRight: 6,
    },
    website: {
        fontSize: 14,
        color: '#00B46E',
    },
});

export default EmployeeIdCard;
