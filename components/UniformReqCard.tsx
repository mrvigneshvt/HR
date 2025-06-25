import { View, Text } from 'react-native';
import React from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { configFile } from 'config';

type Props = {
  name: string;
  empId: string;
  designation: string;
  gender: string;
  location: string;
  site: string;
  date: string;
  femaleAccessories?: string[];
  status: string;
};

const UniformReqCard = ({
  name,
  empId,
  designation,
  gender,
  location,
  site,
  date,
  femaleAccessories = [],
  status,
}: Props) => {
  const getStatusColor = () => {
    if (status.toLowerCase() === 'active') return 'green';
    if (status.toLowerCase() === 'inactive') return 'gray';
    return 'orange';
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: moderateScale(8),
        borderRadius: moderateScale(16),
        backgroundColor: 'white',
        padding: moderateScale(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.8,
        elevation: 5,
      }}>
      {/* Icon */}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'flex-start',
          borderRadius: moderateScale(24),
          backgroundColor: 'black',
          padding: moderateScale(8),
        }}>
        <Entypo name="shop" size={moderateScale(24)} color={configFile.colorGreen} />
      </View>

      {/* Details */}
      <View style={{ flex: 1, gap: moderateScale(10) }}>
        {/* Top Row: Name + Date */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={{
              backgroundColor: '#E5E5E5',
              borderRadius: moderateScale(8),
              paddingVertical: moderateScale(4),
              paddingHorizontal: moderateScale(8),
              fontWeight: 'bold',
              color: 'black',
              fontSize: moderateScale(14),
            }}>
            {name}
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              borderRadius: moderateScale(8),
              backgroundColor: configFile.colorGreen,
              paddingVertical: moderateScale(4),
              paddingHorizontal: moderateScale(8),
              fontSize: moderateScale(12),
              color: 'white',
            }}>
            {date.split('T')[0]}
          </Text>
        </View>

        {/* Info Rows */}
        <Text style={{ fontSize: moderateScale(14), color: 'black' }}>
          ID: <Text style={{ fontWeight: 'bold' }}>{empId}</Text>
        </Text>
        <Text style={{ fontSize: moderateScale(14), color: 'black' }}>
          Role: <Text style={{ fontWeight: 'bold' }}>{designation}</Text>
        </Text>
        <Text style={{ fontSize: moderateScale(14), color: 'black' }}>
          Gender: <Text style={{ fontWeight: 'bold' }}>{gender}</Text>
        </Text>
        <Text style={{ fontSize: moderateScale(14), color: 'black' }}>
          Site: <Text style={{ fontWeight: 'bold' }}>{site}</Text> | Location:{' '}
          <Text style={{ fontWeight: 'bold' }}>{location}</Text>
        </Text>

        {/* Accessories */}
        {femaleAccessories.length > 0 && (
          <Text style={{ fontSize: moderateScale(13), color: 'black' }}>
            Accessories: <Text style={{ fontWeight: 'bold' }}>{femaleAccessories.join(', ')}</Text>
          </Text>
        )}

        {/* Status */}
        <Text
          style={{
            alignSelf: 'flex-start',
            borderRadius: moderateScale(8),
            paddingVertical: moderateScale(4),
            paddingHorizontal: moderateScale(8),
            fontSize: moderateScale(12),
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: getStatusColor(),
          }}>
          Status: {status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
};

export default UniformReqCard;
