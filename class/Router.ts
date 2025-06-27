import { router } from 'expo-router';

export class NavRouter {
  public static async reDirect(options: { role: string; empID: string }) {
    let role = options.role.toLowerCase();
    let pathname = role == 'employee' ? '/(tabs)/dashboard/' : '/(admin)/home';
    if (role == 'employee') {
      router.replace({ pathname, params: options });
      return;
    }

    router.replace({ pathname, params: options });
  }

  public static async backOrigin(options: { role: string; empId: string }) {
    let role = options.role.toLowerCase();
    let pathname = role == 'employee' ? '/(tabs)/dashboard/' : '/(admin)/home';
    if (role == 'employee') {
      router.replace({ pathname, params: options });
      return;
    }

    router.replace({ pathname, params: options });
  }
}
