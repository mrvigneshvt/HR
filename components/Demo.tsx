import { View, Text, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import React, { useState } from 'react';

const Demo = () => {
  const demo = [require('assets/attendDemo1.png'), require('assets/attendDemo2.png')];
  const [showDemo, setShowDemo] = useState(false);
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: '#F8F8F8',
        padding: scale(16),
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Text
          style={{
            fontSize: moderateScale(18),
            fontWeight: '600',
            marginBottom: verticalScale(20),
            textAlign: 'center',
          }}>
          Waiting for API key...
        </Text>

        <Pressable
          style={{
            backgroundColor: '#ffffff',
            borderRadius: scale(8),
            paddingVertical: verticalScale(10),
            paddingHorizontal: scale(20),
            marginBottom: verticalScale(16),
            elevation: 2,
          }}
          onPress={() => setShowDemo(!showDemo)}>
          <Text
            style={{
              fontSize: moderateScale(14),
              fontWeight: '500',
              color: '#333',
              textAlign: 'center',
            }}>
            {!showDemo ? 'Click to see how this page looks' : 'Hide Demo'}
          </Text>
        </Pressable>

        {showDemo && (
          <View style={{ marginTop: verticalScale(10), alignItems: 'center' }}>
            <Image
              source={demo[0]}
              style={{ width: scale(300), height: verticalScale(300), borderRadius: scale(12) }}
              contentFit="contain"
            />
            <Image
              source={demo[1]}
              style={{ width: scale(300), height: verticalScale(300), borderRadius: scale(12) }}
              contentFit="contain"
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Demo;
