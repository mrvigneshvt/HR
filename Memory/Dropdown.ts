// Memory/Dropdown.ts
import { create } from 'zustand';

type DropdownData = {
  clients: any[];
  employees: any[];
  setDropdownData: (type: 'client' | 'employee', data: any[]) => void;
  clearDropdownData: () => void;
};

export const useDropdownStore = create<DropdownData>((set) => ({
  clients: [],
  employees: [],
  setDropdownData: (type, data) =>
    set((state) => ({
      ...state,
      [type === 'client' ? 'clients' : 'employees']: data,
    })),
  clearDropdownData: () =>
    set({
      clients: [],
      employees: [],
    }),
}));
