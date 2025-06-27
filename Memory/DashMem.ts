import { create } from 'zustand';

interface userDatas {
  name: string;
  role: 'Employee' | 'Executive';
  id: string;
  age: string;
  gender: string;
  mobile: string;
  marital_status: string;
  designation: string;
  department: string;
  address: string;
  date_of_joining: string;
}

interface userMonthlyDatas {
  month: string;
  totalDays: number;
  present: number;
  absent: number;
  late: number;
}

interface attendanceTypes {
  checkIn: boolean;
  checkInTime: null | string;
  checkOut: boolean;
  checkOutTime: null | string;
  location: {
    lat: number;
    lon: number;
  };
}

export type Dashboard = {
  user: {
    details: userDatas;
    dailyAttendance?: attendanceTypes;
    monthlyReports?: userMonthlyDatas;
  };
};

interface DashMemoryType {
  dashboard: Dashboard | null;
  setEmployeeData: (raw: any) => void;
  getEmployeeName: () => string | undefined;
  clearDashboard: () => void;
}

export const DashMemory = create<DashMemoryType>((set, get) => ({
  dashboard: null,

  setEmployeeData: (raw) => {
    const transformed: Dashboard = {
      user: {
        details: {
          id: raw.employee_id,
          name: raw.name,
          role: raw.role,
          age: raw.age,
          gender: raw.gender?.toLowerCase(),
          mobile: raw.contact_mobile_no,
          marital_status: raw.marital_status,
          designation: raw.designation.trim(),
          department: raw.department,
          address: raw.communication_address,
          date_of_joining: raw.date_of_joining,
        },
      },
    };

    set({ dashboard: transformed });
  },

  getEmployeeName: () => get().dashboard?.user.details.name,

  clearDashboard: () => set({ dashboard: null }),
}));
