import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type StatusTypes = 'present' | 'absent' | 'late';

interface StatusSelectorProps {
  status: StatusTypes | '';
  setStatus: (status: StatusTypes) => void;
}

const STATUS_COLORS = {
  present: '#4CAF50',
  late: '#FFC107',
  absent: '#F44336',
};

export const StatusSelector: React.FC<StatusSelectorProps> = ({ status, setStatus }) => {
  return (
    <View style={styles.statusContainer}>
      {(Object.keys(STATUS_COLORS) as StatusTypes[]).map((s) => {
        const isSelected = status === s;
        const backgroundColor = isSelected ? 'white' : '#f0f0f0';
        const shadowColor = STATUS_COLORS[s];
        return (
          <TouchableOpacity
            key={s}
            onPress={() => setStatus(s)}
            style={[
              styles.statusCard,
              { backgroundColor },
              isSelected && {
                shadowColor,
                shadowOpacity: 0.4,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: 5,
              },
            ]}>
            <View style={[styles.dot, { backgroundColor: STATUS_COLORS[s] }]} />
            <Text style={styles.statusText}>{s}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    elevation: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    textTransform: 'capitalize',
    fontSize: 14,
  },
});
