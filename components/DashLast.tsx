import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { configFile } from '../config';
import { verticalScale, scale, moderateScale } from 'react-native-size-matters';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Fontisto from '@expo/vector-icons/Fontisto';

type Props = {
  role: string;
  cardSize: number;
  empId: string;
  isMale: boolean;
};

const names = ['Attendance', 'Pay slip', 'Uniform Request', 'Leave Request']; // Change this to test odd/even
const icon1 = <Ionicons name="finger-print" size={54} color="white" />;
const icon3 = <MaterialCommunityIcons name="cash-check" size={54} color="white" />;
const icon4 = <Ionicons name="shirt" size={54} color="white" />;
const icon5 = <Fontisto name="holiday-village" size={54} color="white" />;
const icons = [icon1, icon3, icon4, icon5];

const DashLast = ({ role, cardSize, empId, isMale }: Props) => {
  const isOdd = names.length % 2 !== 0;

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: verticalScale(20),
          borderRadius: moderateScale(16),
          paddingTop: verticalScale(32),
          // marginBottom: verticalScale(80),
          //paddingBottom: verticalScale(200),
        },
      ]}>
      <View style={[styles.gridContainer, { paddingBottom: verticalScale(40) }]}>
        {names.map((num, i) => {
          const isLastItem = i === names.length - 1;

          return (
            <View
              key={num}
              style={[
                styles.cardWrapper,
                isOdd && isLastItem ? styles.fullWidthCard : styles.halfWidthCard,
              ]}>
              <Pressable
                onPress={() => {
                  names[i] === 'Uniform Request' ||
                  names[i] === 'ID Card' ||
                  names[i] === 'Pay slip' ||
                  names[i] === 'Leave Request'
                    ? router.push({
                        pathname: `/emp-plugins/${names[i].toLowerCase().replace(' ', '_')}`,
                        params: {
                          role,
                          empId,
                          isMale,
                        },
                      })
                    : router.push({
                        pathname: `/dashboard/${names[i].toLowerCase()}`,
                        params: {
                          role,
                          empId,
                        },
                      });
                }}
                style={[
                  styles.card,
                  {
                    height: scale(cardSize),
                    backgroundColor: configFile.colorGreen,
                    marginBottom: verticalScale(8),
                    borderRadius: moderateScale(12),
                  },
                ]}>
                {icons[i]}
                <Text style={styles.cardText}>{num}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = {
  container: {
    width: '100%',
    backgroundColor: 'white',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    marginBottom: verticalScale(8),
  },
  halfWidthCard: {
    width: '48%',
  },
  fullWidthCard: {
    width: '100%',
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: 'white',
    marginTop: verticalScale(12),
    textAlign: 'center',
  },
};

export default DashLast;
