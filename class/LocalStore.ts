import * as SecureStore from 'expo-secure-store';

export class LocalStore {
  private static tokenKey = 'token';

  public static async storeTokenLocal(token: string): Promise<void> {
    try {
      console.log('Storing Token:: ', token);
      await SecureStore.setItemAsync(LocalStore.tokenKey, token, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY, // required for persistency on Android
      });
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  public static async getTokenLocal(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(LocalStore.tokenKey);
      console.log('Reteriving token:: ', token);
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  public static async deleteTokenLocal(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(LocalStore.tokenKey);
    } catch (error) {
      console.error('Error deleting token:', error);
    }
  }
}
