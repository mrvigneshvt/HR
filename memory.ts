import { create } from 'zustand';

interface DashType {
  Month: string;
  TotalDays: number;
  Present: number;
  Absent: number;
  late: number;
}

interface UserData {
  name: string;
  empId: number;
  role: string;
  Dash: DashType;
  Notification: { data: [string, string, string][] };
}

interface AppState {
  currentUser: UserData | null;
  setUser: (user: UserData) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  setUser: (user) => set({ currentUser: user }),
}));
