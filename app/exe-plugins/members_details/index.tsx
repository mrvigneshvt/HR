import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { customPlugins } from 'plugins/plug';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { configFile } from 'config';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import ProfileScreen from 'app/(tabs)/profile';
import ProfileStack from 'Stacks/HeaderStack';
import { router } from 'expo-router';

const MembersDetails = () => {
  const datas = customPlugins.getExampleIdDatas();
  const data = datas[0];
  console.log(data);

  interface interProps {
    name: string;
    role: string;
    empId: string;
    emergencyNo: number;
    imageUri: string;
  }

  const onPress = (DATA: interProps) => {
    router.push({
      pathname: '/exe-plugins/members_details/id_card',
      params: {
        name: DATA.name,
        role: DATA.role,
        empId: DATA.empId,
        emergencyNo: DATA.emergencyNo,
        imageUri: DATA.imageUri,
      },
    });
  };

  return (
    <>
      <ProfileStack Database={true} />
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <ScrollView contentContainerStyle={{ padding: moderateScale(16) }}>
          {datas.map((d, i) => (
            <TouchableOpacity
              key={i}
              onPress={() =>
                onPress({
                  name: d.name,
                  role: d.designation,
                  empId: d.empId,
                  emergencyNo: d.emergencyNumber,
                  imageUri: d.imageUri,
                })
              }
              style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                borderRadius: moderateScale(12),
                padding: moderateScale(16),
                marginBottom: verticalScale(10),
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: configFile.colorGreen,
                  borderRadius: 50,
                  padding: scale(12),
                  marginRight: moderateScale(12),
                }}>
                <MaterialIcons name="perm-identity" size={scale(24)} color="#fff" />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: moderateScale(16),
                    fontWeight: '600',
                    marginBottom: scale(4),
                  }}>
                  {d.name} ({d.empId})
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name="location-outline"
                    size={scale(18)}
                    color={configFile.colorGreen}
                    style={{ marginRight: scale(6) }}
                  />
                  <Text style={{ fontSize: moderateScale(14), color: '#555' }}>{d.siteName}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default MembersDetails;
