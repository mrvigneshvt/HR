import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { configFile } from 'config';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

type Props = {
  from: string;
  date: string;
  message: string;
};

const MailCard = ({ from, date, message }: Props) => {
  const handleDelete = () => {
    alert('The Function isnt Connected Yet . Check UI as of now ');
  };
  if (from && date && message) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: moderateScale(8), // Adjusting gap with moderateScale
          borderRadius: moderateScale(16), // Rounded corners with moderateScale
          backgroundColor: 'white',
          padding: moderateScale(12), // Padding with moderateScale for responsiveness
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.8,
          elevation: 5,
        }}>
        {/* Icon Block */}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-start',
            borderRadius: moderateScale(24), // Rounded icon background
            backgroundColor: 'black',
            padding: moderateScale(8), // Adjust padding using moderateScale
          }}>
          <Entypo name="mail" size={moderateScale(24)} color={configFile.colorGreen} />
        </View>

        {/* Text Block */}
        <View style={{ flex: 1, gap: moderateScale(10) }}>
          {/* Top Row: Admin + Date */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text
              style={{
                backgroundColor: '#E5E5E5',
                borderRadius: moderateScale(8),
                paddingVertical: moderateScale(4),
                paddingHorizontal: moderateScale(8),
                fontWeight: 'bold',
                color: 'black',
                fontSize: moderateScale(14), // Font size responsive
              }}>
              {from}
            </Text>
            <View style={{ flexDirection: 'row', gap: moderateScale(12) }}>
              <Pressable onPress={handleDelete}>
                <EvilIcons name="trash" size={moderateScale(24)} color="red" />
              </Pressable>
              <Text
                style={{
                  alignSelf: 'center',
                  borderRadius: moderateScale(8),
                  backgroundColor: configFile.colorGreen,
                  paddingVertical: moderateScale(4),
                  paddingHorizontal: moderateScale(8),
                  fontSize: moderateScale(12), // Font size responsive
                  color: 'white',
                }}>
                {date}
              </Text>
            </View>
          </View>

          {/* Message */}
          <Text
            style={{
              fontSize: moderateScale(14), // Font size responsive
              color: 'black',
            }}>
            {message}
          </Text>
        </View>
      </View>
    );
  }
};

export default MailCard;
