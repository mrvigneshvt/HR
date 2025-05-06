import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import notification from '../app/emp-plugins/notification';
import { customPlugins } from 'plugins/plug';

interface userDatas {
  name: string;
  role: 'Employee' | 'Executive';
  id: string;
}

type NotificationAll = {
  id: number;
  name: string;
  message: string;
  date: string;
  clear: boolean;
};

type NotificationApproval = {
  id: number;
  name: string;
  date: string;
  empId: string;
  leaveReason: string;
  from: string;
  to: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  clear: boolean;
};

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
    dailyAttendance: attendanceTypes;
    monthlyReports: userMonthlyDatas;
    notificationAll: NotificationAll[];
    notificationApproval?: NotificationApproval[];
  };
};

interface DashMemoryType {
  dashboard: Dashboard | null;
  setDashboard: (data: Dashboard) => void;
  getNotification: () => NotificationAll[] | [];
  getNotificationApp: () => NotificationApproval[] | [];
  deleteNotification: (id: number) => boolean;
}

const sample = true;

export const DashMemory = create<DashMemoryType>((set, get) => ({
  dashboard: sample ? customPlugins.getExampleDatas('exe') : null,
  setDashboard: (data: Dashboard) => set({ dashboard: data }),

  // Get all notifications
  getNotification: () => get().dashboard?.user.notificationAll ?? [],

  getNotificationApp: () => get().dashboard?.user.notificationApproval ?? [],

  // Delete notification by ID
  deleteNotification: (id: number) => {
    const currentNotifications = get().dashboard?.user.notificationAll ?? [];
    console.log(`Receiving ID to delete ${id}`);

    // Filter the notifications to remove the one with the given ID
    const updatedNotifications = currentNotifications.filter(
      (notification) => notification.id !== id
    );

    console.log(`Receiving ID to delete ${id}`);

    // Check if a notification was actually deleted
    const deleted = updatedNotifications.length !== currentNotifications.length;

    // Update the state if something was deleted
    if (deleted) {
      console.log(deleted);
    }

    return deleted; // return true if deleted, otherwise false
  },
}));
