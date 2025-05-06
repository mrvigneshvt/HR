import { customPlugins } from 'plugins/plug';
import { create } from 'zustand';

type peopleDatas = {
  empId: string;
  name: string;
  relationName: string;
  dateJoining: string;
  dob: string;
  siteName: string;
  designation:
    | 'Executive'
    | 'Employee'
    | 'HOD'
    | 'HR'
    | 'Finance'
    | 'Branch Head'
    | 'Senior Operation Executive'
    | 'Operation Executive';
  branch: string;
  mobile: number;
  emergencyNumber: number;
  gender: 'Male' | 'Female';
  address: string;
  aadhar: number;
  pan: string;
  accountNo: string;
  accountIfsc: string;
  maritalStatus: 'Married' | 'UnMarried';
  nomineeName: string;
  nomineeRelation: string;
  familyMemberName: string;
  familyMemberRelation: string;
  UanNumber: number;
  EsicNumber: number;
};

type datas = peopleDatas[];

interface attendMem {
  memory: datas | null;
}

const sample = true;
export const AttendMemory = create((set, get) => ({
  memory: sample ? customPlugins.getExampleIdDatas : null,
}));
