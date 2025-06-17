import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { UniformRequest } from '../services/requests';

interface UniformRequestFormProps {
  form: UniformRequest;
  onChange: (field: keyof UniformRequest, value: any) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export interface ValidationErrors {
  [key: string]: string;
}

const validateUniformRequest = (data: Partial<UniformRequest>): ValidationErrors => {
  const errors: ValidationErrors = {};
  if (!data.empId?.trim()) errors.empId = 'Employee ID is required';
  if (!data.name?.trim()) errors.name = 'Name is required';
  if (!data.designation?.trim()) errors.designation = 'Designation is required';
  if (!data.site?.trim()) errors.site = 'Site is required';
  if (!data.location?.trim()) errors.location = 'Location is required';
  if (!data.gender) errors.gender = 'Gender is required';
  if (!data.status) errors.status = 'Status is required';
  if (data.gender === 'Male') {
    if (!data.shirtSize?.trim()) errors.shirtSize = 'Shirt size is required';
    if (!data.pantSize?.trim()) errors.pantSize = 'Pant size is required';
  } else if (data.gender === 'Female') {
    if (!data.chuditharSize?.trim()) errors.chuditharSize = 'Chudithar size is required';
    if (!data.femaleShoeSize?.trim()) errors.femaleShoeSize = 'Female shoe size is required';
  }
  if (!data.shoeSize?.trim() && data.gender === 'Male') errors.shoeSize = 'Shoe size is required';
  if (!data.requestedDate) errors.requestedDate = 'Requested date is required';
  // accessories/femaleAccessories can be empty arrays
  return errors;
};

const UniformRequestForm: React.FC<UniformRequestFormProps> = ({
  form,
  onChange,
  onSubmit,
  loading = false,
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = () => {
    const validation = validateUniformRequest(form);
    setErrors(validation);
    if (Object.keys(validation).length === 0) {
      onSubmit();
    }
  };

  return (
    <ScrollView className="max-h-[70%]">
      <TextInput
        className="mb-1 rounded-lg border border-gray-300 p-3"
        placeholder="Employee ID"
        value={form.empId}
        onChangeText={(text) => onChange('empId', text)}
      />
      {errors.empId && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.empId}</Text>}
      <TextInput
        className="mb-1 rounded-lg border border-gray-300 p-3"
        placeholder="Name"
        value={form.name}
        onChangeText={(text) => onChange('name', text)}
      />
      {errors.name && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.name}</Text>}
      <TextInput
        className="mb-1 rounded-lg border border-gray-300 p-3"
        placeholder="Designation"
        value={form.designation}
        onChangeText={(text) => onChange('designation', text)}
      />
      {errors.designation && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.designation}</Text>}
      <TextInput
        className="mb-1 rounded-lg border border-gray-300 p-3"
        placeholder="Site"
        value={form.site}
        onChangeText={(text) => onChange('site', text)}
      />
      {errors.site && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.site}</Text>}
      <TextInput
        className="mb-1 rounded-lg border border-gray-300 p-3"
        placeholder="Location"
        value={form.location}
        onChangeText={(text) => onChange('location', text)}
      />
      {errors.location && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.location}</Text>}
      <View className="mb-1 flex-row items-center justify-between">
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
      {errors.gender && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.gender}</Text>}
      <View className="mb-1 flex-row items-center justify-between">
        <Text>Status:</Text>
        <View className="flex-row gap-4">
          <Pressable
            onPress={() => onChange('status', 'Active')}
            className={`rounded-lg px-4 py-2 ${form.status === 'Active' ? 'bg-green-500' : 'bg-gray-200'}`}
          >
            <Text className={form.status === 'Active' ? 'text-white' : 'text-black'}>Active</Text>
          </Pressable>
          <Pressable
            onPress={() => onChange('status', 'Inactive')}
            className={`rounded-lg px-4 py-2 ${form.status === 'Inactive' ? 'bg-green-500' : 'bg-gray-200'}`}
          >
            <Text className={form.status === 'Inactive' ? 'text-white' : 'text-black'}>Inactive</Text>
          </Pressable>
        </View>
      </View>
      {errors.status && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.status}</Text>}
      {form.gender === 'Male' ? (
        <>
          <TextInput
            className="mb-1 rounded-lg border border-gray-300 p-3"
            placeholder="Shirt Size"
            value={form.shirtSize}
            onChangeText={(text) => onChange('shirtSize', text)}
            keyboardType="numeric"
          />
          {errors.shirtSize && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.shirtSize}</Text>}
          <TextInput
            className="mb-1 rounded-lg border border-gray-300 p-3"
            placeholder="Pant Size"
            value={form.pantSize}
            onChangeText={(text) => onChange('pantSize', text)}
            keyboardType="numeric"
          />
          {errors.pantSize && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.pantSize}</Text>}
        </>
      ) : (
        <>
          <TextInput
            className="mb-1 rounded-lg border border-gray-300 p-3"
            placeholder="Chudithar Size"
            value={form.chuditharSize}
            onChangeText={(text) => onChange('chuditharSize', text)}
            keyboardType="numeric"
          />
          {errors.chuditharSize && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.chuditharSize}</Text>}
          <TextInput
            className="mb-1 rounded-lg border border-gray-300 p-3"
            placeholder="Female Shoe Size"
            value={form.femaleShoeSize}
            onChangeText={(text) => onChange('femaleShoeSize', text)}
            keyboardType="numeric"
          />
          {errors.femaleShoeSize && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.femaleShoeSize}</Text>}
        </>
      )}
      {form.gender === 'Male' && (
        <>
          <TextInput
            className="mb-1 rounded-lg border border-gray-300 p-3"
            placeholder="Shoe Size"
            value={form.shoeSize}
            onChangeText={(text) => onChange('shoeSize', text)}
            keyboardType="numeric"
          />
          {errors.shoeSize && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.shoeSize}</Text>}
        </>
      )}
      {/* Accessories (comma separated) */}
      <TextInput
        className="mb-1 rounded-lg border border-gray-300 p-3"
        placeholder="Accessories (comma separated)"
        value={form.accessories.join(',')}
        onChangeText={(text) => onChange('accessories', text.split(',').map((a) => a.trim()).filter(Boolean))}
      />
      <TextInput
        className="mb-1 rounded-lg border border-gray-300 p-3"
        placeholder="Female Accessories (comma separated)"
        value={form.femaleAccessories.join(',')}
        onChangeText={(text) => onChange('femaleAccessories', text.split(',').map((a) => a.trim()).filter(Boolean))}
      />
      {/* Requested Date */}
      <TextInput
        className="mb-1 rounded-lg border border-gray-300 p-3"
        placeholder="Requested Date (DD/MM/YY)"
        value={typeof form.requestedDate === 'string' ? form.requestedDate : (form.requestedDate ? new Date(form.requestedDate).toLocaleDateString('en-GB') : '')}
        onChangeText={(text) => onChange('requestedDate', text)}
      />
      {errors.requestedDate && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.requestedDate}</Text>}
      {/* Flab */}
      <TextInput
        className="mb-1 rounded-lg border border-gray-300 p-3"
        placeholder="Flab (optional)"
        value={form.flab}
        onChangeText={(text) => onChange('flab', text)}
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

export default UniformRequestForm; 