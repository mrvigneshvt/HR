import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterIcon = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={{ alignSelf: 'flex-end', margin: 16 }}>
    <Ionicons name="filter" size={24} color="#8F9BB3" />
  </TouchableOpacity>
);

export default FilterIcon;  