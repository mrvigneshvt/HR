import { View, Text, Pressable, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { configFile } from '../config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { DashMemory } from 'Memory/DashMem';
import { router } from 'expo-router';
import { BackHandler } from 'react-native';
import { NavRouter } from 'class/Router';

const green = configFile.colorGreen;
const date = 10;

const datas = [
  [<MaterialIcons name="calendar-month" size={moderateScale(24)} color={green} />, 'Days', 30],
  [<MaterialIcons name="verified" size={moderateScale(24)} color={green} />, 'Present', 1],
  [<Octicons name="unverified" size={moderateScale(24)} color={'red'} />, 'Absent', 0],
  [<AntDesign name="warning" size={moderateScale(24)} color={'#ffd400'} />, 'Late', 8],
];

type Props = {
  Dimensions: Record<string, number>; // passed width from parent component,
  Month: string;
  Days: number;
  Absent: number;
  late: number;
};

const DashBottom = ({ Dimensions, Month, Days, Absent, late }: Props) => {
  const gap = scale(8);
  const cardsPerRow = 4;
  const totalGap = gap * (cardsPerRow - 1);
  const cardWidth = (Dimensions.width - totalGap) / cardsPerRow;

  const getRole = DashMemory((state) => state.dashboard?.user.details.role);
  console.log('fole fetched', getRole);

  useEffect(() => {
    // const onBackPress = () => {
    //   router.replace({
    //     pathname: '/home',
    //     params: { role, empId },
    //   });
    //   return true;
    // };
    // BackHandler.addEventListener('hardwareBackPress', onBackPress);
    // return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    NavRouter.BackHandler({ role, empId });
  }, []);

  return (
    <LinearGradient
      colors={['rgba(0,222,11,1)', 'rgba(97,37,143,1)', 'rgba(35,140,88,1)']}
      start={{ x: 0.2, y: 1 }}
      end={{ x: 1, y: 0.2 }}
      style={{
        padding: moderateScale(16),
        borderRadius: moderateScale(6),
        paddingBottom: verticalScale(30),
        position: 'relative',
        bottom: verticalScale(-8),
      }}>
      <View
        style={{
          marginLeft: scale(4),
          flexDirection: 'row',
          padding: scale(8),
          gap: scale(8),
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: moderateScale(16),
            fontWeight: 'bold',
            color: 'white',
          }}>
          {Month}
        </Text>
        <Text
          style={{
            fontSize: moderateScale(20),
            fontWeight: '800',
            color: 'white',
          }}>
          {date}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap }}>
          {datas.map((d, i) => (
            <Pressable key={i} style={{ width: cardWidth }}>
              <View
                style={{
                  alignItems: 'center',
                  gap: verticalScale(4),
                  padding: moderateScale(16),
                  backgroundColor: 'white',
                  borderRadius: moderateScale(16),
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                }}>
                {d[0]}
                <Text style={{ fontWeight: 'bold', fontSize: moderateScale(12) }}>{d[1]}</Text>
                <Text style={{ fontSize: moderateScale(12) }}>{d[2]}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default DashBottom;
