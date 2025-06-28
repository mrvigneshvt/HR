import { router } from 'expo-router';
import { BackHandler } from 'react-native';
import { Api } from './HandleApi';

interface NesParamsTypes {
  role: string;
  empId: string;
  name?: string;
}
export class NavRouter {
  public static async reDirect(path: string, options: { role: string; empID: string }) {
    let role = options.role.toLowerCase();
    if (role == 'employee') {
      router.replace({ pathname: path, params: options });
      return;
    }

    router.replace({ pathname: path, params: options });
  }

  public static async backOrigin(options: { role: string; empId: string }) {
    let role = options.role.toLowerCase();
    let pathname = role == 'employee' ? '/(tabs)/dashboard/' : '/(admin)/home';
    if (role == 'employee') {
      router.replace({ pathname, params: options });
      return;
    }

    router.replace({ pathname, params: options });
    return;
  }

  public static async BackHandler(options: NesParamsTypes) {
    console.log('backHandlerExe:::', options);
    const path = async () => await this.backOrigin({ role: options.role, empId: options.empId });
    BackHandler.addEventListener('hardwareBackPress', path);
    return () => BackHandler.removeEventListener('hardwareBackPress', path);
  }

  public static automateRoute(empID: string) {}
}
