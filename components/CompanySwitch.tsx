import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { company } from 'Memory/Token';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

interface Props {
  company: company;
  setCompany: React.Dispatch<React.SetStateAction<company>>;
}

const CompanySwitch = ({ company, setCompany }: Props) => {
  return (
    <TouchableOpacity
      className="mx-2"
      onPress={() => setCompany((prev) => (prev === 'sdce' ? 'sq' : 'sdce'))}>
      {company === 'sdce' ? (
        <MaterialIcons name="security" size={24} color="white" />
      ) : (
        <MaterialCommunityIcons name="home-city" size={24} color="white" />
      )}
    </TouchableOpacity>
  );
};

export default CompanySwitch;
