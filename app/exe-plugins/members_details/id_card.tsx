import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import { Image } from 'expo-image';
import { configFile } from 'config';
import QRCode from 'react-native-qrcode-svg';
import * as ScreenCapture from 'expo-screen-capture';
import ProfileStack from 'Stacks/HeaderStack';

interface interProps {
  name: string;
  role: string;
  empId: string;
  emergencyNo: number;
  imageUri: string;
}

const { width, height } = Dimensions.get('window');

const baseUrl = 'www.sdcefm.com';

const id_card = () => {
  const [showPersonal, setShowPersonal] = useState(false);
  const [time, setTime] = useState(9);
  const searchParams = useLocalSearchParams();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    const handleScreenCapture = async () => {
      if (showPersonal) {
        setTime(10);
        await ScreenCapture.preventScreenCaptureAsync();

        intervalId = setInterval(() => {
          setTime((prev) => {
            if (prev <= 1) {
              setShowPersonal(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        timeoutId = setTimeout(() => {
          setShowPersonal(false);
        }, 10000);
      } else {
        await ScreenCapture.allowScreenCaptureAsync();
      }
    };

    handleScreenCapture();

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, [showPersonal]);

  const { name, role, empId, emergencyNo, imageUri }: interProps = useLocalSearchParams();

  const imageSize = width * 0.5;

  return (
    <>
      <View className="flex-1 items-center justify-center bg-white">
        <View
          style={{
            marginTop: verticalScale(10),
            paddingHorizontal: scale(40),
            paddingVertical: verticalScale(20),
            borderRadius: moderateScale(20),
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.8,
            elevation: 5,
          }}>
          <View className="mb-4 flex-row items-center justify-center">
            <Image
              source={require('../../../assets/logo.jpg')}
              style={{
                resizeMode: 'cover',
                height: verticalScale(80),
                width: scale(80),
              }}
            />
          </View>

          <View className="mb-4 items-center justify-center">
            {showPersonal ? (
              <View
                style={{
                  height: imageSize,
                  width: imageSize,
                  borderWidth: 2,
                  borderRadius: scale(45),
                  borderColor: configFile.colorGreen,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <QRCode value={baseUrl} size={imageSize * 0.7} />
              </View>
            ) : (
              <Image
                source={imageUri}
                contentFit="contain"
                style={{
                  height: imageSize,
                  width: imageSize,
                  borderWidth: 2,
                  borderRadius: scale(45),
                  borderColor: configFile.colorGreen,
                }}
              />
            )}
          </View>

          <View className="mb-2 items-center justify-center">
            <Text style={{ fontSize: moderateScale(20), fontWeight: 'bold' }}>{name}</Text>
            <View className="mt-1 flex-row items-center justify-center gap-2">
              <Text
                style={{
                  fontSize: moderateScale(16),
                  fontWeight: 'bold',
                  color: configFile.colorGreen,
                }}>
                {role}
              </Text>
              <Text style={{ fontSize: moderateScale(24), fontWeight: '900', color: '#000' }}>
                |
              </Text>
              <Text style={{ fontSize: moderateScale(14), fontWeight: 'bold', color: '#555' }}>
                {empId}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setShowPersonal((d) => !d)}
            style={{
              backgroundColor: configFile.colorGreen,
              paddingVertical: verticalScale(10),
              paddingHorizontal: scale(20),
              borderRadius: scale(25),
              alignSelf: 'center',
              marginTop: verticalScale(10),
            }}>
            <Text style={{ color: 'white', fontSize: moderateScale(12), fontWeight: 'bold' }}>
              {!showPersonal ? 'Show Personal Details' : `Hide Details (${time})`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default id_card;
