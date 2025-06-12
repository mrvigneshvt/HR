import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { CreateClientPayload, Client } from '../services/api';

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: CreateClientPayload) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateClientPayload>({
    clientName: '',
    companyName: '',
    phoneNumber: '',
    gstNumber: '',
    site: '',
    branch: '',
    address: '',
    location: '',
    latitude: '',
    longitude: '',
    status: 'Active',
    checkIn: '',
    lunch_time: '',
    check_out: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateClientPayload, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        clientName: initialData.clientName,
        companyName: initialData.companyName,
        phoneNumber: initialData.phoneNumber,
        gstNumber: initialData.gstNumber,
        site: initialData.site,
        branch: initialData.branch,
        address: initialData.address,
        location: initialData.location,
        latitude: initialData.latitude,
        longitude: initialData.longitude,
        status: initialData.status,
        checkIn: initialData.check_in || '',
        lunch_time: initialData.lunch_time || '',
        check_out: initialData.check_out || '',
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateClientPayload, string>> = {};

    // Required fields
    const requiredFields: (keyof CreateClientPayload)[] = [
      'clientName',
      'companyName',
      'phoneNumber',
      'site',
      'branch',
      'address',
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Phone number validation
    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    // Time validation
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (formData.checkIn && !timeRegex.test(formData.checkIn)) {
      newErrors.checkIn = 'Invalid time format (HH:MM:SS)';
    }
    if (formData.lunch_time && !timeRegex.test(formData.lunch_time)) {
      newErrors.lunch_time = 'Invalid time format (HH:MM:SS)';
    }
    if (formData.check_out && !timeRegex.test(formData.check_out)) {
      newErrors.check_out = 'Invalid time format (HH:MM:SS)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderInput = (
    label: string,
    field: keyof CreateClientPayload,
    placeholder: string,
    keyboardType: 'default' | 'numeric' | 'phone-pad' = 'default'
  ) => (
    <View className="mb-4">
      <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
      <TextInput
        className={`rounded-lg border p-3 ${
          errors[field] ? 'border-red-500' : 'border-gray-300'
        }`}
        value={formData[field]}
        onChangeText={(text) => {
          setFormData((prev) => ({ ...prev, [field]: text }));
          if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
          }
        }}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
      {errors[field] && (
        <Text className="mt-1 text-sm text-red-500">{errors[field]}</Text>
      )}
    </View>
  );

  return (
    <ScrollView className="flex-1">
      {renderInput('Client Name', 'clientName', 'Enter client name')}
      {renderInput('Company Name', 'companyName', 'Enter company name')}
      {renderInput('Phone Number', 'phoneNumber', 'Enter phone number', 'phone-pad')}
      {renderInput('GST Number', 'gstNumber', 'Enter GST number')}
      {renderInput('Site', 'site', 'Enter site')}
      {renderInput('Branch', 'branch', 'Enter branch')}
      {renderInput('Address', 'address', 'Enter address')}
      {renderInput('Location', 'location', 'Enter location')}
      {renderInput('Latitude', 'latitude', 'Enter latitude', 'numeric')}
      {renderInput('Longitude', 'longitude', 'Enter longitude', 'numeric')}
      {renderInput('Check-in Time', 'checkIn', 'Enter check-in time (HH:MM:SS)')}
      {renderInput('Lunch Time', 'lunch_time', 'Enter lunch time (HH:MM:SS)')}
      {renderInput('Check-out Time', 'check_out', 'Enter check-out time (HH:MM:SS)')}

      <View className="mt-4 flex-row justify-end gap-2">
        <Pressable
          onPress={onCancel}
          disabled={isLoading}
          className="rounded-lg bg-gray-200 px-4 py-2"
        >
          <Text>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          disabled={isLoading}
          className="rounded-lg bg-blue-500 px-4 py-2"
        >
          <Text className="text-white">
            {isLoading ? 'Loading...' : initialData ? 'Save' : 'Add'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default ClientForm; 