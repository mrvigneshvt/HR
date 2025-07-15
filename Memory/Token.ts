import { create } from 'zustand';

export type company = 'sq' | 'sdce';

interface tokenMemoryType {
  authToken: string | null;
  company: 'sq' | 'sdce' | null;

  setAuthToken: (data: any) => void;
  getAuthToken: () => string | null;
  deleteAuthToken: () => void;

  setCompany: (data: company) => void;
  getCompany: () => company | null;
}

export const tokenMemory = create<tokenMemoryType>((set, get) => ({
  authToken: null,
  company: null,

  setAuthToken: (token: string) => {
    set({ authToken: token });
  },

  getAuthToken: () => get().authToken,

  deleteAuthToken: () => set({ authToken: null }),

  getCompany: () => get().company,

  setCompany: (data: 'sdce' | 'sq') => {
    set({ company: data });
  },
}));
