import { Linking, View } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { configFile } from '../config';
import { verticalScale, moderateScale } from 'react-native-size-matters';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import TileButton from 'components/TileButton'; // ✅ Reusable component
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
type Props = {
  role: string;
  cardSize: number;
  empId: string;
  isMale: boolean;
  esiCard: string | undefined;
};

const DashLast = ({ role, cardSize, empId, isMale }: Props) => {
  const tiles = [
    {
      label: 'Pay slip',
      icon: <MaterialCommunityIcons name="cash-check" size={54} color="white" />,
      route: '/emp-plugins/pay_slip',
    },
    // {
    //   label: 'Leave Request',
    //   icon: <Fontisto name="holiday-village" size={54} color="white" />,
    //   route: '/emp-plugins/leave_request',
    // },
    {
      label: 'ID Card',
      icon: <FontAwesome5 name="id-card-alt" size={54} color="white" />,
      url: `${configFile.frontendBaseUrl}idcard?empId=${empId}`,
      isBrowser: true,
    },
    {
      label: 'ESI Card',
      icon: <FontAwesome name="vcard" size={54} color="white" />,
      route: '/profile',
    },
  ];

  const isOdd = tiles.length % 2 !== 0;

  return (
    <View
      style={{
        width: '100%',
        backgroundColor: 'white',
        marginTop: verticalScale(20),
        borderRadius: moderateScale(16),
        paddingTop: verticalScale(32),
      }}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          paddingBottom: verticalScale(40),
        }}>
        {tiles.map((tile, i) => {
          const isLast = i === tiles.length - 1;
          const width = isOdd && isLast ? '100%' : '48%';
          return (
            <TileButton
              key={tile.label}
              label={tile.label}
              icon={tile.icon}
              width={width}
              height={cardSize}
              color={configFile.colorGreen}
              onPress={() =>
                !tile.isBrowser
                  ? router.push({
                      pathname: tile.route,
                      params: { role, empId, isMale },
                    })
                  : Linking.openURL(tile.url)
              }
            />
          );
        })}
      </View>
    </View>
  );
};

export default DashLast;
