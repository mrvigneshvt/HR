import { router } from 'expo-router';
import { BackHandler } from 'react-native';
import { Api } from './HandleApi';

interface NesParamsTypes {
  stayLogout?: boolean;
  role: string;
  empId: string;
  name?: string;
  company: 'sdce' | 'sq';
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

  public static stayBack() {
    const path = () => {
      router.replace('/login');
      return true; // Prevent default back action
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', path);

    // Return cleanup function, optional to use
    return () => subscription.remove();
  }

  public static async backOrigin(options: {
    role: string;
    empId: string;
    company?: 'sdce' | 'sq';
  }) {
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

    const path = async () => {
      await this.backOrigin({ role: options.role, empId: options.empId, company: options.company });
      return true; // Make sure to return true to prevent default back behavior
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', path);

    // Return a cleanup function
    return () => subscription.remove();
  }
  public static automateRoute(empID: string) {}
}
