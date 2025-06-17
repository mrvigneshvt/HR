import React from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { UniformRequest } from '../services/requests';

interface UniformRequestFormProps {
  form: UniformRequest;
  onChange: (field: keyof UniformRequest, value: any) => void;
  onSubmit: () => void;
  loading?: boolean;
}

const UniformRequestForm: React.FC<UniformRequestFormProps> = ({
  form,
  onChange,
  onSubmit,
  loading = false,
}) => {
  return (
    <ScrollView className="max-h-[70%]">
      <TextInput
        className="mb-4 rounded-lg border border-gray-300 p-3"
        placeholder="Employee ID"
        value={form.empId}
        onChangeText={(text) => onChange('empId', text)}
      />
      <TextInput
        className="mb-4 rounded-lg border border-gray-300 p-3"
        placeholder="Name"
        value={form.name}
        onChangeText={(text) => onChange('name', text)}
      />
      <TextInput
        className="mb-4 rounded-lg border border-gray-300 p-3"
        placeholder="Designation"
        value={form.designation}
        onChangeText={(text) => onChange('designation', text)}
      />
      <TextInput
        className="mb-4 rounded-lg border border-gray-300 p-3"
        placeholder="Site"
        value={form.site}
        onChangeText={(text) => onChange('site', text)}
      />
      <TextInput
        className="mb-4 rounded-lg border border-gray-300 p-3"
        placeholder="Location"
        value={form.location}
        onChangeText={(text) => onChange('location', text)}
      />
      <View className="mb-4 flex-row items-center justify-between">
        <Text>Gender:</Text>
        <View className="flex-row gap-4">
          <Pressable
            onPress={() => onChange('gender', 'Male')}
            className={`rounded-lg px-4 py-2 ${form.gender === 'Male' ? 'bg-blue-500' : 'bg-gray-200'}`}
          >
            <Text className={form.gender === 'Male' ? 'text-white' : 'text-black'}>Male</Text>
          </Pressable>
          <Pressable
            onPress={() => onChange('gender', 'Female')}
            className={`rounded-lg px-4 py-2 ${form.gender === 'Female' ? 'bg-blue-500' : 'bg-gray-200'}`}
          >
            <Text className={form.gender === 'Female' ? 'text-white' : 'text-black'}>Female</Text>
          </Pressable>
        </View>
      </View>
      {form.gender === 'Male' ? (
        <>
          <TextInput
            className="mb-4 rounded-lg border border-gray-300 p-3"
            placeholder="Shirt Size"
            value={form.shirtSize}
            onChangeText={(text) => onChange('shirtSize', text)}
          />
          <TextInput
            className="mb-4 rounded-lg border border-gray-300 p-3"
            placeholder="Pant Size"
            value={form.pantSize}
            onChangeText={(text) => onChange('pantSize', text)}
          />
        </>
      ) : (
        <TextInput
          className="mb-4 rounded-lg border border-gray-300 p-3"
          placeholder="Chudithar Size"
          value={form.chuditharSize}
          onChangeText={(text) => onChange('chuditharSize', text)}
        />
      )}
      <TextInput
        className="mb-4 rounded-lg border border-gray-300 p-3"
        placeholder="Shoe Size"
        value={form.shoeSize}
        onChangeText={(text) => onChange('shoeSize', text)}
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

export default UniformRequestForm; 