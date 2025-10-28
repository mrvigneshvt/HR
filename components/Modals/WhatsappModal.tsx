import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { configFile } from 'config';
import { Api } from 'class/HandleApi';

interface WhatsappModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  empId: string;
  onSuccess: () => void;
}

const WhatsappModal = (props: WhatsappModalProps) => {
  const ApiCall = async () => {
    setApi(true);
    const request = await Api.handleApi({
      url: configFile.api.resendOtp,
      type: 'POST',
      payload: {
        employee_id: props.empId,
        mode: 'whatsapp',
      },
    });

    console.log(request, '//req');

    if (!request) {
      Alert.alert('Something Went Wrong !');
      setApi(false);
    }

    switch (request.status) {
      case 200:
        Alert.alert('OTP Sent', 'Otp has been sent to your Whatsapp Mobile Number');
        props.setShowModal(false);
        setApi(false);
        props.onSuccess();
        return;

      case 404:
        Alert.alert('Session Timeout', 'The Session Expired or No longer Valid Please Login Again');
        props.setShowModal(false);
        setApi(false);
        return router.replace('/login');

      default:
        Alert.alert('Oops ', 'Something Went Wrong Try Again Later :(');
        props.setShowModal(false);
        setApi(false);
      // router.replace('/login');
    }
  };

  const [api, setApi] = useState<boolean>(false);
  return (
    <Modal visible={props.showModal} animationType="slide" transparent>
      <Pressable
        className="flex-1 items-center justify-center"
        style={styles.overlay}
        onPress={() => props.setShowModal(false)}>
        <View className="flex-column m-3 items-center justify-center gap-6 rounded-xl bg-white p-12">
          <View className="flex flex-row items-center justify-center gap-5">
            {/* <MaterialIcons name="error" size={24} color="black" /> */}
            <Entypo name="emoji-sad" size={24} color="black" />

            <Text className="text-2xl font-extrabold text-gray-900">Sorry For the Trouble</Text>
          </View>
          <Text className="mt-2 px-3 text-center text-gray-400">
            Didn’t receive the OTP? It may be delayed due to network issues, spam protection, or
            carrier filters. Please wait a moment and try again. or
          </Text>
          <View>
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 rounded-2xl p-3"
              style={{ backgroundColor: 'green' }}
              disabled={api ? true : false}
              onPress={() => {
                ApiCall();
              }}>
              {!api ? (
                <>
                  <Text className="font-semibold text-gray-100">Get OTP on </Text>
                  <FontAwesome name="whatsapp" size={24} color="white" />
                </>
              ) : (
                <ActivityIndicator color={'white'} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default WhatsappModal;
