import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type StatusTypes = 'present' | 'absent' | 'late';

interface FilterProps {
  onPress: () => void;
  filters: {
    startDate?: string;
    endDate?: string;
    status?: StatusTypes;
    employeeId?: string;
  };
}

const getStatusColor = (status?: StatusTypes) => {
  switch (status) {
    case 'present':
      return '#4CAF50'; // green
    case 'late':
      return '#FFC107'; // yellow
    case 'absent':
      return '#F44336'; // red
    default:
      return '#ccc';
  }
};

const FilterIcon: React.FC<FilterProps> = ({ onPress, filters }) => {
  const hasActiveFilters =
    filters.startDate || filters.endDate || filters.status || filters.employeeId;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <MaterialIcons name="filter-list" size={28} color={hasActiveFilters ? '#1E88E5' : '#777'} />
      {hasActiveFilters && (
        <View style={styles.chipsContainer}>
          {filters.employeeId && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>ID: {filters.employeeId}</Text>
            </View>
          )}
          {filters.startDate && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>Start: {filters.startDate}</Text>
            </View>
          )}
          {filters.endDate && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>End: {filters.endDate}</Text>
            </View>
          )}
          {filters.status && (
            <View style={[styles.chip, { borderColor: getStatusColor(filters.status) }]}>
              <Text style={styles.chipText}>
                <Text style={{ color: getStatusColor(filters.status) }}>● </Text>
                {filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default FilterIcon;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
  },
  chip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
});
