import { useEmployeeStore } from 'Memory/Employee';
import { company, tokenMemory } from 'Memory/Token';

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

  ///////////////////////////////JWT///////////////////////////////////////////

  public static storeToken(token: string) {
    if (token) {
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
    return tokenMemory.getState().deleteAuthToken();
  }

  ////////////////////////////////////////////////////////////////////////////
}
