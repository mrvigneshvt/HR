import {
  View,
  Text,
  TextInput,
  Switch,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';
import ProfileStack from 'Stacks/HeaderStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { configFile } from '../../config';
import FontAwesome from '@expo/vector-icons/FontAwesome';
const Uniform = () => {
  const [isMale, setIsMale] = useState<boolean>(true);

  const [state, setState] = useState({
    empId: 'EMP123',
    designation: 'Engineer',
    site: 'Site A',
    location: 'Chennai',
    ...(isMale
      ? {
          shirtSize: '',
          pantSize: '',
        }
      : {
          chudiSize: '',
        }),
    shoeSize: '',
    belt: false,
    lanyard: false,
    whistle: false,
    idCard: false,
    cap: false,
  });

  //console.log(state);

  const toggleSwitch = (key: keyof typeof state) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInput = (key: keyof typeof state, value: string, limit: number) => {
    if (/^\d*$/.test(value) && value.length <= limit) {
      setState((prev) => ({ ...prev, [key]: value }));
    }
  };

  return (
    <>
      <ProfileStack Uniform={true} />

      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
          <ScrollView
            style={{ flex: 1, backgroundColor: 'white' }}
            contentContainerStyle={{
              flexGrow: 1,
              padding: scale(16),
              paddingBottom: 40,
            }}>
            <View className="flex-row items-center justify-center gap-2">
              <Text>Male:</Text>
              <Switch value={isMale} onValueChange={() => setIsMale((d) => !d)} />
              <Text>'(This is for Testing)'</Text>
            </View>
            {/* Read-only fields */}
            {['empId', 'designation', 'site', 'location'].map((field, index) => (
              <View key={index} style={{ marginBottom: verticalScale(12) }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{field.toUpperCase()}</Text>
                <Text
                  style={{
                    borderColor: '#ccc',
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 8,
                    backgroundColor: '#f2f2f2',
                  }}>
                  {state[field as keyof typeof state]}
                </Text>
              </View>
            ))}

            {isMale ? (
              <>
                <View style={{ marginBottom: verticalScale(12) }}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Shirt Size</Text>
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={2}
                    value={state.shirtSize}
                    onChangeText={(text) => handleInput('shirtSize', text, 2)}
                    style={styles.input}
                  />
                </View>

                <View style={{ marginBottom: verticalScale(12) }}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Pant Size</Text>
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={2}
                    value={state.pantSize}
                    onChangeText={(text) => handleInput('pantSize', text, 2)}
                    style={styles.input}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={{ marginBottom: verticalScale(12) }}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Chudi Size</Text>
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={2}
                    value={state.chudiSize}
                    onChangeText={(text) => handleInput('chudiSize', text, 2)}
                    style={styles.input}
                  />
                </View>
              </>
            )}
            <View style={{ marginBottom: verticalScale(12) }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Shoe Size</Text>
              <TextInput
                keyboardType="number-pad"
                maxLength={2}
                value={state.shoeSize}
                onChangeText={(text) => {
                  if (/^\d*$/.test(text) && parseInt(text || '0') <= 20) {
                    setState((prev) => ({ ...prev, shoeSize: text }));
                  }
                }}
                style={styles.input}
              />
            </View>

            {/* Boolean checkboxes */}
            {['belt', 'lanyard', 'whistle', 'idCard', 'cap'].map((key, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: verticalScale(12),
                }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{key.toUpperCase()}</Text>
                <Switch
                  value={state[key as keyof typeof state] as boolean}
                  onValueChange={() => toggleSwitch(key as keyof typeof state)}
                />
              </View>
            ))}
            <Pressable
              className={`bg-[${configFile.colorGreen}] flex-row items-center justify-center gap-1.5 self-center rounded-xl p-4 text-white`}>
              <Text className="font-semibold text-white">Request Uniform</Text>
              {isMale ? (
                <FontAwesome name="male" size={24} color="white" />
              ) : (
                <FontAwesome name="female" size={24} color="white" />
              )}
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = {
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: Platform.OS === 'android' ? 8 : 10,
    borderRadius: 8,
    marginTop: 4,
  },
};

export default Uniform;
