import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  label: string;
  value: boolean;
  setValue: (val: boolean) => void;
}

const Checkbox = ({ label, value, setValue }: Props) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={() => setValue(!value)}>
      <View style={[styles.checkbox, value && styles.checked]}>
        {value && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#555',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});

export default Checkbox;
