import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Sidebar = () => {
  const [state, setState] = useState(false);
  return (
    <>
      {!state && (
        <View className="">
          <Pressable onPress={() => setState(!state)}>
            <MaterialCommunityIcons name="dots-grid" size={24} color="black" />
          </Pressable>
        </View>
      )}

      {state && (
        <>
          <View className="absolute left-0 top-full h-screen w-screen flex-row">
            <View className="h-screen w-2/3 bg-red-800">
              <View className="flex-col gap-9">
                <Text>ello</Text>
                <Text>Hello</Text>
                <Text>Hello</Text>
                <Text>Hello</Text>
                <Text>Hello</Text>

                <Text>Hello</Text>

                <Text>Hello</Text>

                <Text>Hello</Text>

                <Text>Hello</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default Sidebar;
