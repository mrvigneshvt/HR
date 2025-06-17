import React from 'react';
import { View, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder = 'Search...' }) => {
  return (
    <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-4 py-2">
      <MaterialIcons name="search" size={20} color="#666" />
      <TextInput
        className="ml-2 flex-1"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#666"
      />
    </View>
  );
};

export default SearchBar; 