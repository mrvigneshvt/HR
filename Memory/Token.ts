import { create } from 'zustand';

interface tokenMemoryType {
  authToken: string | null;
  setAuthToken: (data: any) => void;
  getAuthToken: () => string | null;
  deleteAuthToken: () => void;
}

export const tokenMemory = create<tokenMemoryType>((set, get) => ({
  authToken: null,

  setAuthToken: (token: string) => {
    set({ authToken: token });
  },

  getAuthToken: () => get().authToken,

  deleteAuthToken: () => set({ authToken: null }),
}));
