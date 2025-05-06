import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import LoadingScreen from 'components/LoadingScreen';

const Index = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>ADMIN Dashboard in PROGRESS...</Text>
      <LoadingScreen color="#e8f5e9" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // light green background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32', // dark green text
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Index;
