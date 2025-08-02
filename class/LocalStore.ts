import AsyncStorage from '@react-native-async-storage/async-storage';

export class LocalStore {
  private static tokenKey = 'token';

  public static async storeTokenLocal(token: string): Promise<void> {
    console.log('Storing Token:: ', token);
    await AsyncStorage.setItem(LocalStore.tokenKey, token);
  }

  public static async getTokenLocal(): Promise<string | null> {
    const token = await AsyncStorage.getItem(LocalStore.tokenKey);
    console.log('Retrieving Token:: ', token);
    return token;
  }

  public static async deleteTokenLocal(): Promise<void> {
    await AsyncStorage.removeItem(LocalStore.tokenKey);
  }
}
