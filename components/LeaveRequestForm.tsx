import React from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { LeaveRequest } from '../services/requests';
import DateTimePicker from '@react-native-community/datetimepicker';

interface LeaveRequestFormProps {
  form: LeaveRequest;
  onChange: (field: keyof LeaveRequest, value: any) => void;
  onSubmit: () => void;
  loading?: boolean;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  form,
  onChange,
  onSubmit,
  loading = false,
}) => {
  return (
    <ScrollView className="max-h-[60%]">
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
          {['Sick', 'Vacation', 'Casual', 'Maternity', 'Other'].map((type) => (
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
        <Text>Start Date:</Text>
        <DateTimePicker
          value={form.startDate}
          mode="date"
          onChange={(event, date) => {
            if (date) onChange('startDate', date);
          }}
        />
      </View>
      <View className="mb-4">
        <Text>End Date:</Text>
        <DateTimePicker
          value={form.endDate}
          mode="date"
          onChange={(event, date) => {
            if (date) onChange('endDate', date);
          }}
        />
      </View>
      <TextInput
        className="mb-4 rounded-lg border border-gray-300 p-3"
        placeholder="Number of Days"
        value={form.numberOfDays.toString()}
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
          onPress={onSubmit}
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