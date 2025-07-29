import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import LoadingScreen from 'components/LoadingScreen';
import { useLocalSearchParams, router } from 'expo-router';
import PopupMessage from 'components/Popup';
import { Api } from 'class/HandleApi';
import { useEmployeeStore } from 'Memory/Employee';
type popUpType = 'Internal Server Error' | 'Employee Not Found';

const FetchNParse = () => {
  const params = useLocalSearchParams();
  console.log(params, '/////////////////params', params.empRole);
  const { empId, role, company }: any = useLocalSearchParams();
  const [popMsg, setPopMsg] = useState<string>('Internal Server Error');
  console.log(params.empRole);
  // const { empId, role } = empRole;

  const storeZustand = async () => {
    const api: any = await Api.getEmpData(empId);
    if (api) {
      useEmployeeStore.getState().setEmployee(api);
    }
  };

  useEffect(() => {
    storeZustand();
    if (role === 'employee') {
      router.replace({
        pathname: '/(tabs)/dashboard',
        params: { role, empId },
      });
    } else {
      console.log('goes under handle EMp data');
      Api.handleEmpData(empId, company ? company : undefined); // Fetch data n Navigate if needed
    }
  }, [role, empId]);

  const handlePopUps = (data: popUpType) => {
    setPopMsg(data);
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <LoadingScreen />
      {/* <Text>{`Welcome ${role}`}</Text> */}
      {/* <PopupMessage text={popMsg} duration={3000} /> */}
    </View>
  );
};

export default FetchNParse;
