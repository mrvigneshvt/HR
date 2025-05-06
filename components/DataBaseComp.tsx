import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { configFile } from 'config';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const text = 'Members Details';

const DataBase = () => {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/exe-plugins/${text.toLowerCase().replace(' ', '_')}`)}
      style={[styles.container, { backgroundColor: 'white' }]}
      className="mb-8 flex-row  items-center justify-center gap-2 rounded-2xl p-6">
      <MaterialCommunityIcons name="server-security" size={24} color={configFile.colorGreen} />
      <Text style={styles.title}>Members Details</Text>
    </TouchableOpacity>
  );
};

export default DataBase;

const styles = StyleSheet.create({
  container: {
    borderColor: configFile.colorGreen,
    borderWidth: 1,
  },
  image: {
    width: scale(150),
    height: verticalScale(150),
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: configFile.colorGreen,
  },
});
