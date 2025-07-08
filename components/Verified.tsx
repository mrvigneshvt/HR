import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';

import { View, Text } from 'react-native';
import React from 'react';

interface Props {
  verified: boolean;
  size?: number;
}

const Verified = ({ verified, size }: Props) => {
  return verified ? (
    <MaterialIcons name="verified" size={size || 24} color="#5fbfdb" />
  ) : (
    <Octicons name="unverified" size={size || 24} color="#E4060C" />
  );
};

export default Verified;
