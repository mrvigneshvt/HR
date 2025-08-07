import { useDropdownStore } from 'Memory/Dropdown';
import { useEmployeeStore } from 'Memory/Employee';
import { company, tokenMemory } from 'Memory/Token';
import { LocalStore } from './LocalStore';
import { configFile } from 'config';

export class State {
  public static storeEmpData(response) {
    useEmployeeStore.getState().setEmployee(response);
    console.log('STORED EMP DATA::: ', this.empData());
  }
  public static empData() {
    // const data = Das
    const data = useEmployeeStore.getState().employee;

    return data;
  }

  public static storeToken(token: string) {
    if (token) {
      LocalStore.storeTokenLocal(token);
      tokenMemory.getState().setAuthToken(token);
      return true;
    }
    return false;
  }
  public static toggleCompany(data: company) {
    if (data == 'sdce') {
      this.storeCompany('sq');
      return this.getCompany();
    }
    this.storeCompany('sdce');
    return this.getCompany();
  }

  public static storeCompany(data: company) {
    if (data) {
      tokenMemory.getState().setCompany(data);
      return true;
    }
    return false;
  }

  public static getCompany() {
    return tokenMemory.getState().getCompany();
  }

  public static getToken() {
    return tokenMemory.getState().getAuthToken();
  }

  public static deleteToken() {
    tokenMemory.getState().deleteAuthToken();
    LocalStore.deleteTokenLocal();
    return;
  }

  public static async reloadDropdown(type: 'client' | 'employee') {
    const url = configFile.api.superAdmin.getEmployeeDropdown(type);
    //mohinth `https://sdce.lyzooapp.co.in:31313/api/employees/dropdownPhone?dropdownName=${type}`;
    try {
      const res = await fetch(url);
      const json = await res.json();

      const formatted = json.data.map((entry: any) => ({
        label:
          type === 'client'
            ? entry.client_name || 'Unnamed Client'
            : entry.name || 'Unnamed Employee',
        value:
          type === 'client'
            ? entry.client_no?.toString() || 'N/A'
            : entry.employee_id?.toString() || 'N/A',
        full: entry,
      }));

      useDropdownStore.getState().setDropdownData(type, formatted);
      console.log(`✅ ${type} dropdown reloaded`);
      return formatted;
    } catch (e) {
      console.error(`❌ Failed to reload ${type} dropdown`, e);
      return [];
    }
  }

  // 📦 Get cached dropdown data
  public static getDropdownData(type: 'client' | 'employee') {
    const store = useDropdownStore.getState();
    return type === 'client' ? store.clients : store.employees;
  }

  // ❌ Clear all dropdown data
  public static clearDropdownData() {
    useDropdownStore.getState().clearDropdownData();
    console.log('🧹 Dropdown data cleared');
  }

  public static async preloadAllDropdowns() {
    await Promise.all([this.reloadDropdown('client'), this.reloadDropdown('employee')]);
  }
}
