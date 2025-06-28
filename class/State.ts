import { useEmployeeStore } from 'Memory/Employee';

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
}
