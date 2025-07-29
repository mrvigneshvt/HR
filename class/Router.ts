import { router } from 'expo-router';
import { BackHandler } from 'react-native';
import { Api } from './HandleApi';

interface NesParamsTypes {
  stayLogout?: boolean;
  role: string;
  empId: string;
  name?: string;
  company: 'sdce' | 'sq';
  route?: string;
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
  public static BackHandler(options: NesParamsTypes) {
    console.log('backHandlerExe:::', options);

    const backPressHandler = () => {
      try {
        if (options.route) {
          router.replace({
            pathname: options.route,
            params: {
              empId: options.empId,
              role: options.role,
              company: options.company,
            },
          });
        } else {
          this.backOrigin?.({ role: options.role, empId: options.empId, company: options.company });
        }
      } catch (err) {
        console.error('Error in backOrigin:', err);
      }
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', backPressHandler);

    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      } else {
        console.warn('BackHandler cleanup: remove() not available');
      }
    };
  }
  public static automateRoute(empID: string) {}
}
