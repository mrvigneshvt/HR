import { router } from 'expo-router';

export class Flow {
  public static dynamicRole(data: Record<string, any>) {
    try {
      console.log(data, 'dataaaaaaa');
      if (data.status === 'InActive') {
        router.replace('/quarantine');
        return;
      }
      if (data.inAppRole === 'Employee') {
        router.replace('/ApiContex/fetchNparse');
        return;
      }
    } catch (error) {
      console.log('error in Flow/dynamicRole:', error);
    }
  }
}
