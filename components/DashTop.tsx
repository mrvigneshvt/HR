import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import React from 'react';
import { configFile } from '../config';
import { router } from 'expo-router';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

type Props = {
  role?: string;
  name?: string;
  empId: string;
  img?: string;
};

const IconImage = require('../assets/profile.png');

const DashTop = ({ role, name, empId, img }: Props) => {
  return (
    <Pressable
    // onPress={() =>
    //   router.push({
    //     pathname: '/profile',
    //     params: {
    //       role,
    //       empId,
    //     },
    //   })
    // }
    >
      <View
        style={{
          marginHorizontal: scale(16),
          marginVertical: verticalScale(24),
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: moderateScale(16),
          backgroundColor: 'white',
          padding: moderateScale(16),
          gap: scale(8),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
        {/* Profile Image */}
        <Image
          source={!img ? IconImage : img}
          style={{
            height: scale(60),
            width: scale(60),
            borderRadius: scale(30),
            borderWidth: 1,
            borderColor: '#e5e7eb',
          }}
        />

        <View>
          <View className="flex flex-row">
            <Text
              style={{
                fontSize: moderateScale(12),
                color: '#6b7280',
                marginBottom: verticalScale(4),
              }}>
              Welcome back
            </Text>
            <Text className="text-md  font-bold "> {role?.toUpperCase() || ''}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8) }}>
            {/* <Text
              style={{
                fontSize: moderateScale(18),
                fontWeight: 'bold',
                color: '#000',
              }}>
              {role.toUpperCase()}
            </Text> */}
            <Text
              style={{
                fontSize: moderateScale(18),
                fontWeight: 'bold',
                color: configFile.colorGreen,
              }}>
              {name || ''}
            </Text>
          </View>

          <Text
            style={{
              marginTop: verticalScale(4),
              fontSize: moderateScale(12),
              fontWeight: '600',
              color: 'black',
            }}>
            ID: {empId || ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default DashTop;
