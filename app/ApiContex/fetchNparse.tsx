import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import LoadingScreen from 'components/LoadingScreen';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import PopupMessage from 'components/Popup';
import { Api } from 'class/HandleApi';
// import * as SecureStore from 'expo-secure-store';

type popUpType = 'Internal Server Error' | 'Employee Not Found';

const fetchNparse = () => {
  const empRole: any = useLocalSearchParams();
  const [popMsg, setPopMsg] = useState<string>('Internal Server Error');
  const { empId, role } = empRole;
  console.log(empRole, '/////empRole');

  const handlePopUps = (data: popUpType) => {
    setPopMsg(data);
  };

  useEffect(() => {
    Api.handleEmpData(empId); //Fetch data n Navigate Screen Accordingly
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <LoadingScreen />
      {<Text>{`Welcome ${empRole['role']}`}</Text>}
      {/* <PopupMessage text={popMsg} duration={3000} /> */}
    </View>
  );
};

export default fetchNparse;
