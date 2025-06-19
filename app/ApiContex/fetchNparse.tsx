import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import LoadingScreen from 'components/LoadingScreen';
import { useLocalSearchParams, router } from 'expo-router';
import PopupMessage from 'components/Popup';
import { Api } from 'class/HandleApi';
import { useEmployeeStore } from 'Memory/Employee';
type popUpType = 'Internal Server Error' | 'Employee Not Found';

const FetchNParse = () => {
  const empRole: any = useLocalSearchParams();
  const [popMsg, setPopMsg] = useState<string>('Internal Server Error');

  const { empId, role } = empRole;

  const storeZustand = async () => {
    const api: any = await Api.getEmpData(empId);
    if (api) {
      useEmployeeStore.getState().setEmployee(api);
    }
  };

  useEffect(() => {
    if (role === 'employee') {
      router.replace({
        pathname: '/(tabs)/dashboard',
        params: { role, empId },
      });
    } else {
      Api.handleEmpData(empId); // Fetch data n Navigate if needed
    }
  }, [role, empId]);

  const handlePopUps = (data: popUpType) => {
    setPopMsg(data);
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <LoadingScreen />
      <Text>{`Welcome ${empRole['role']}`}</Text>
      {/* <PopupMessage text={popMsg} duration={3000} /> */}
    </View>
  );
};

export default FetchNParse;
