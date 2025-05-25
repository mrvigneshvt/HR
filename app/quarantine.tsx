import React, { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { configFile } from 'config';
import { router } from 'expo-router';

const Quarantine = () => {
  const [logout, setLogout] = useState(false);
  return (
    <View style={styles.container} className="">
      {/* Card Container */}
      <View style={styles.card}>
        <Image
          source={require('../assets/quarantine.svg')}
          style={styles.image}
          contentFit="contain"
        />

        <Text style={styles.statusLabel}>Your Employee Status is</Text>

        <View style={styles.statusPill}>
          <Text style={styles.statusText}>InActive</Text>
        </View>
      </View>

      {/* Spacer */}
      <View style={{ height: verticalScale(24) }} />

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          logout ? router.replace('/') : setLogout(true);
        }}>
        {!logout ? (
          <>
            <MaterialIcons name="logout" size={24} color={configFile.colorGreen} />
          </>
        ) : (
          <View className="flex-row gap-2">
            <Text style={styles.logoutText}>Logout</Text>
            <MaterialIcons name="logout" size={scale(24)} color={configFile.colorGreen} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Quarantine;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    color: 'grey',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(32),
  },
  card: {
    width: '100%',
    maxWidth: scale(320),
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    shadowColor: configFile.colorGreen, //'#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1.12,
    shadowRadius: 12,
    elevation: 8,
  },
  image: {
    width: scale(160),
    height: verticalScale(140),
    marginBottom: verticalScale(20),
  },
  statusLabel: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: verticalScale(12),
  },
  statusPill: {
    backgroundColor: configFile.colorGreen,
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(50),
  },
  statusText: {
    color: '#ffffff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'black',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(32),
    borderRadius: moderateScale(50),
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: configFile.colorGreen,
    fontSize: moderateScale(14),
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
