import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import React from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { configFile } from 'config';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

type Props = {
  id: number;
  name: string;
  empId: string;
  leaveReason: string;
  from: string;
  to: string;
  date: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
};

const LeaveReqCard = ({ id, name, empId, leaveReason, from, to, date, approvalStatus }: Props) => {
  const handleDelete = () => {
    alert('Delete not connected yet');
  };

  const getStatusColor = () => {
    if (approvalStatus === 'approved') return 'green';
    if (approvalStatus === 'rejected') return 'red';
    return 'orange';
  };

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
        <Entypo name="calendar" size={moderateScale(24)} color={configFile.colorGreen} />
      </View>

      {/* Text Block */}
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
              fontSize: moderateScale(14), // Font size responsive
            }}>
            {`${name}`}
          </Text>
          <View style={{ flexDirection: 'row', gap: moderateScale(12) }}>
            {/* <Pressable onPress={handleDelete}>
              <EvilIcons name="trash" size={moderateScale(24)} color="red" />
            </Pressable> */}
            <Text
              style={{
                alignSelf: 'center',
                borderRadius: moderateScale(8),
                backgroundColor: configFile.colorGreen,
                // paddingVertical: moderateScale(4),
                // paddingHorizontal: moderateScale(8),
                fontSize: moderateScale(10), // Font size responsive
                color: 'white',
              }}>
              {/* {date} */}
            </Text>
          </View>
        </View>

        {/* Middle Row: Leave Reason */}
        <Text style={{ fontSize: moderateScale(14), color: 'black' }}>
          Id: <Text style={{ fontWeight: 'bold' }}>{empId}</Text>
        </Text>
        <Text style={{ fontSize: moderateScale(14), color: 'black' }}>
          Reason: <Text style={{ fontWeight: 'bold' }}>{leaveReason}</Text>
        </Text>

        {/* Date Range */}
        <Text style={{ fontSize: moderateScale(12), color: 'black' }}>
          From <Text style={{ fontWeight: 'bold' }}>{from}</Text> to{' '}
          <Text style={{ fontWeight: 'bold' }}>{to}</Text>
        </Text>

        {/* Bottom Row: Status */}
        <Text
          style={{
            alignSelf: 'flex-start',
            borderRadius: moderateScale(8),
            paddingVertical: moderateScale(4),
            paddingHorizontal: moderateScale(8),
            fontSize: moderateScale(12), // Font size responsive
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: getStatusColor(),
          }}>
          Status: {approvalStatus.toUpperCase()}
        </Text>
        {/* <View style={{ flexDirection: 'row', gap: moderateScale(16) }}>
          <TouchableOpacity>
            <Text
              style={{
                borderRadius: moderateScale(8),
                backgroundColor: 'green',
                paddingVertical: moderateScale(6),
                paddingHorizontal: moderateScale(12),
                fontSize: moderateScale(12),
                color: 'white',
              }}>
              Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              style={{
                borderRadius: moderateScale(8),
                backgroundColor: 'red',
                paddingVertical: moderateScale(6),
                paddingHorizontal: moderateScale(12),
                fontSize: moderateScale(12),
                color: 'white',
              }}>
              Reject
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

export default LeaveReqCard;
