import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ value, onChangeText, placeholder }: { value: string, onChangeText: (text: string) => void, placeholder: string }) => (
  <View style={styles.container}>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#E4E9F2"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  input: {
    padding: 12,
    fontSize: 16,
    color: '#222B45',
  },
});

export default SearchBar; 