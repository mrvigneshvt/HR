import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import EntityDropdown from './DropDown';

export type StatusTypes = 'present' | 'absent' | 'late' | '';
export type TypeFilter = 'client' | 'others';

interface FilterProps {
  showFilterModal: boolean;
  setShowFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: React.Dispatch<
    React.SetStateAction<{
      startDate?: string;
      endDate?: string;
      status?: StatusTypes;
      type?: TypeFilter;
      employeeId: string;
    }>
  >;
  empId: string;
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const AttendFilterModal: React.FC<FilterProps> = ({
  showFilterModal,
  setShowFilterModal,
  setFilters,
  empId,
}) => {
  const [type, setType] = useState<TypeFilter>('client');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<StatusTypes | null>(null);
  const [employeeId, setEmployeeId] = useState<string>(empId);
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(null);

  useEffect(() => {
    if (showFilterModal) setEmployeeId(empId);
  }, [showFilterModal, empId]);

  const handleApply = () => {
    if (!employeeId) return alert('Please select an employee');

    let appliedStartDate = startDate;
    let appliedEndDate = endDate;

    if (startDate && !endDate) appliedEndDate = startDate;
    else if (endDate && !startDate) appliedStartDate = endDate;

    setFilters({
      employeeId,
      ...(appliedStartDate && { startDate: formatDate(appliedStartDate) }),
      ...(appliedEndDate && { endDate: formatDate(appliedEndDate) }),
      ...(status && { status }),
      ...(type && { type }),
    });

    setShowFilterModal(false);
  };

  return (
    <Modal transparent visible={showFilterModal} animationType="slide">
      <Pressable style={styles.overlay} onPress={() => setShowFilterModal(false)} />
      <View style={styles.modal}>
        <Text style={styles.title}>Apply Filters</Text>

        <EntityDropdown
          type="employee"
          setState={setEmployeeId}
          selected={employeeId}
          placeholder="Select Employee"
          inputStyle={styles.dropdownInput}
        />

        <TouchableOpacity onPress={() => setShowDatePicker('start')}>
          <Text style={styles.field}>
            Start Date: {startDate ? formatDate(startDate) : 'Select'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowDatePicker('end')}>
          <Text style={styles.field}>End Date: {endDate ? formatDate(endDate) : 'Select'}</Text>
        </TouchableOpacity>

        <View style={styles.statusContainer}>
          {(['present', 'late', 'absent'] as StatusTypes[]).map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.statusCard, status === s && styles[`shadow_${s}`]]}
              onPress={() => setStatus(s)}>
              <View style={[styles.dot, styles[`dot_${s}`]]} />
              <Text style={styles.statusLabel}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.typeSelector}>
          {(['client', 'others'] as TypeFilter[]).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setType(t)}
              style={[styles.typeOption, type === t && styles.selectedType]}>
              <Text style={styles.typeText}>{t === 'client' ? 'Client' : 'Others'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => {
              if (date) {
                showDatePicker === 'start' ? setStartDate(date) : setEndDate(date);
              }
              setShowDatePicker(null);
            }}
          />
        )}

        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AttendFilterModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black',
  },
  dropdownInput: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
  },
  field: {
    fontSize: 16,
    paddingVertical: 10,
    color: '#444',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  shadow_present: {
    elevation: 4,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  shadow_late: {
    elevation: 4,
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  shadow_absent: {
    elevation: 4,
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  dot_present: {
    backgroundColor: '#4CAF50',
  },
  dot_late: {
    backgroundColor: '#FFC107',
  },
  dot_absent: {
    backgroundColor: '#F44336',
  },
  statusLabel: {
    textTransform: 'capitalize',
    fontWeight: '500',
    color: '#333',
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 12,
  },
  typeOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  selectedType: {
    backgroundColor: '#007bff',
  },
  typeText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyText: {
    color: 'white',
    fontSize: 16,
  },
});
