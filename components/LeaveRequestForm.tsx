import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal, Platform } from 'react-native';
import { LeaveRequest } from '../services/requests';
import DateTimePicker from '@react-native-community/datetimepicker';

interface LeaveRequestFormProps {
  form: LeaveRequest;
  onChange: (field: keyof LeaveRequest, value: any) => void;
  onSubmit: () => void;
  loading?: boolean;
}

const leaveTypes = ['Sick', 'Vacation', 'Casual', 'Maternity', 'Other'];
const statusTypes = ['Pending', 'Approved', 'Rejected'];

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  form,
  onChange,
  onSubmit,
  loading = false,
}) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!form.employeeId || !form.employeeName || !form.leaveType || !form.startDate || !form.endDate || !form.status || !form.approvedBy || !form.numberOfDays) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError('End date cannot be before start date.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <ScrollView className="max-h-[90%]">
      {error ? (
        <Text className="mb-2 text-red-500 font-semibold">{error}</Text>
      ) : null}
      <TextInput
        className="mb-4 rounded-lg border border-gray-300 p-3"
        placeholder="Employee ID"
        value={form.employeeId}
        onChangeText={(text) => onChange('employeeId', text)}
      />
      <TextInput
        className="mb-4 rounded-lg border border-gray-300 p-3"
        placeholder="Employee Name"
        value={form.employeeName}
        onChangeText={(text) => onChange('employeeName', text)}
      />
      <View className="mb-4">
        <Text>Leave Type:</Text>
        <View className="mt-2 flex-row flex-wrap gap-2">
          {leaveTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => onChange('leaveType', type)}
              className={`rounded-lg px-4 py-2 ${form.leaveType === type ? 'bg-blue-500' : 'bg-gray-200'}`}
            >
              <Text className={form.leaveType === type ? 'text-white' : 'text-black'}>{type}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View className="mb-4">
        <Text>Status:</Text>
        <View className="mt-2 flex-row flex-wrap gap-2">
          {statusTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => onChange('status', type)}
              className={`rounded-lg px-4 py-2 ${form.status === type ? 'bg-green-500' : 'bg-gray-200'}`}
            >
              <Text className={form.status === type ? 'text-white' : 'text-black'}>{type}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View className="mb-4">
        <Text>Start Date:</Text>
        <Pressable
          className="rounded-lg border border-gray-300 p-3 mt-2"
          onPress={() => setShowStartPicker(true)}
        >
          <Text>{form.startDate ? new Date(form.startDate).toLocaleDateString() : 'Select Start Date'}</Text>
        </Pressable>
        {showStartPicker && (
          <DateTimePicker
            value={form.startDate ? new Date(form.startDate) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowStartPicker(false);
              if (date) onChange('startDate', date);
            }}
          />
        )}
      </View>
      <View className="mb-4">
        <Text>End Date:</Text>
        <Pressable
          className="rounded-lg border border-gray-300 p-3 mt-2"
          onPress={() => setShowEndPicker(true)}
        >
          <Text>{form.endDate ? new Date(form.endDate).toLocaleDateString() : 'Select End Date'}</Text>
        </Pressable>
        {showEndPicker && (
          <DateTimePicker
            value={form.endDate ? new Date(form.endDate) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowEndPicker(false);
              if (date) onChange('endDate', date);
            }}
          />
        )}
      </View>
      <TextInput
        className="mb-4 rounded-lg border border-gray-300 p-3"
        placeholder="Number of Days"
        value={form.numberOfDays ? form.numberOfDays.toString() : ''}
        keyboardType="numeric"
        onChangeText={(text) => onChange('numberOfDays', parseInt(text) || 0)}
      />
      <TextInput
        className="mb-4 rounded-lg border border-gray-300 p-3"
        placeholder="Approved By"
        value={form.approvedBy}
        onChangeText={(text) => onChange('approvedBy', text)}
      />
      <View className="mt-4 flex-row justify-end gap-2">
        <Pressable
          onPress={handleSubmit}
          className="rounded-lg bg-blue-500 px-4 py-2"
          disabled={loading}
        >
          <Text className="text-white">{loading ? 'Submitting...' : 'Submit'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default LeaveRequestForm; 