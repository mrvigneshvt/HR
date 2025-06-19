import { create } from 'zustand';

type EmployeeData = {
  aadhaar_number: any;
  account_number: any;
  address_country: any;
  address_district: any;
  address_house: any;
  address_landmark: any;
  address_po: any;
  address_state: any;
  address_street: any;
  address_zip: any;
  age: any;
  bank_address: any;
  bank_branch: any;
  bank_centre: any;
  bank_city: any;
  bank_code: any;
  bank_contact: any;
  bank_district: any;
  bank_name: any;
  bank_state: any;
  branch: any;
  communication_address: any;
  contact_email: any;
  contact_mobile_no: any;
  created_at: any;
  date_of_joining: any;
  department: any;
  designation: any;
  dob: any;
  driving_license: any;
  driving_license_card: any;
  emergency_contact_name: any;
  emergency_contact_phone: any;
  employee_id: any;
  esi_card: any;
  esi_number: any;
  father_spouse_name: any;
  gender: any;
  guardian_name: any;
  id: any;
  ifsc: any;
  imps_enabled: any;
  is_aadhaar_verified: any;
  is_bank_verified: any;
  iso_code: any;
  marital_status: any;
  micr_code: any;
  mobile_verified: any;
  name: any;
  neft_enabled: any;
  pan_card: any;
  pan_number: any;
  profile_image: any;
  reference_id: any;
  reporting: any;
  role: any;
  rtgs_enabled: any;
  status: any;
  swift_code: any;
  uan_number: any;
  updated_at: any;
  upi_enabled: any;
  voter_id: any;
  voter_id_card: any;
};

interface EmployeeStoreType {
  employee: EmployeeData | null;
  setEmployee: (data: EmployeeData) => void;
  clearEmployee: () => void;
}

export const useEmployeeStore = create<EmployeeStoreType>((set) => ({
  employee: null,

  setEmployee: (data) => set({ employee: data }),

  clearEmployee: () => set({ employee: null }),
}));
