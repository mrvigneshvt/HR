import { longFormatters } from 'date-fns';

const backendConnection = 'https';
const backendDomain = 'sdce.lyzooapp.co.in';
const backendPort = '31313';
const backendBaseUrl = `${backendConnection}://${backendDomain}:${backendPort}/`;

export const configFile = {
  colorGreen: '#238c58',
  color: {
    sdce: {
      bg: '2A9D8F',
      cards: '',
      stack: '',
    },
    sq: {
      bg: 'FF7F51',
      cards: '',
      stack: '',
    },
  },
  areYouInOFfice: true,
  backendConnection,
  backendDomain,
  backendPort,
  backendBaseUrl,
  api: {
    credentials: {
      key: 'iaus787sadfsdf837asdsad8223e',
    },
    get baseUrl() {
      return backendBaseUrl;
    },
    verifyToken: `${backendBaseUrl}api/verifyToken`,
    attendance: {
      checkIn() {
        return `${backendBaseUrl}api/attendance/checkIn`; //post
      },
      lunchIn() {
        return `${backendBaseUrl}api/attendance/lunchIn`; //post
      },
      checkOut() {
        return `${backendBaseUrl}api/attendance/checkOut`; //post
      },
    },
    common: {
      login() {
        return `${backendBaseUrl}api/auth/login`;
      },
      verifyOtp() {
        return `${backendBaseUrl}api/auth/verifyOtp`;
      },

      getEmpData(id: any) {
        return `${backendBaseUrl}api/employees/${id}`;
      },

      postLeaveReq() {
        return `${backendBaseUrl}api/Leaves`; //post
      },

      postUniformReq() {
        return `${backendBaseUrl}api/Uniforms`;
      },

      getPaySlip(empId: string, month: string) {
        return `${backendBaseUrl}api/payroll/employees/${empId}?month=${month}`; //2025-06
      },

      getLeaveReq(id: string) {
        return `${backendBaseUrl}api/leaves/${id}`;
      },

      getUniformReq(id: string) {
        return `${backendBaseUrl}api/uniforms/${id}`;
      },
    },
    superAdmin: {
      admin: `${backendBaseUrl}api`,
      report: `${backendBaseUrl}api/reports`,
      reports: `${backendBaseUrl}api/reports/get`,
      idcard: `${backendBaseUrl}api/idcard/`,
      clients: `${backendBaseUrl}api/clients/`,
      attendance: `${backendBaseUrl}api/attendance`,
      getUrl(type:string) {
        return `${backendBaseUrl}api/employees/dropdownPhone?dropdownName=${type}`;
      },
      getUrlForPayroll(employeeId:string,selectedDate:string){
        return `${backendBaseUrl}api/payroll/employees/${employeeId}?month=${selectedDate}`;
      },
      app: {
        aadhar: {
          verify: `${backendBaseUrl}api/aadhaar/generate-otp`,
          verifyOtp: `${backendBaseUrl}api/aadhaar/verify-otp`,
        },
        bank: {
          verify: `${backendBaseUrl}api/bank/verify`,
        },
        uniform: `${backendBaseUrl}api/uniforms/phone`,
        squniform: `${backendBaseUrl}api/uniforms/phone?prefix=SQ`,
        feedback: {
          get: `${backendBaseUrl}api/feedback/get`,
          post: `${backendBaseUrl}api/feedback/assign`,
          delete: `${backendBaseUrl}api/feedback/remove`,
        },

        leave: `${backendBaseUrl}api/leaves/phone`,
        sqleave: `${backendBaseUrl}api/leaves/phone?prefix=SQ`,
        updateEmp: `${backendBaseUrl}api/employees`,
        employees: `${backendBaseUrl}api/employees/phone`,
        sqEmployees: `${backendBaseUrl}api/employees/phone?prefix=SQ`,
        employeeSearch(query: string) {
          return `${backendBaseUrl}api/employees/search/phone?search=${query}`;
        },
        sqEmployeeSearch(query: string) {
          return `${backendBaseUrl}api/employees/search/phone?prefix=SQ&search=${query}`;
        },
      },
      addClient() {
        return `${backendBaseUrl}api/clients`; //post method
      },
      getAllClients(pageNo?: number) {
        return !pageNo
          ? `${backendBaseUrl}api/clients?page=1`
          : `${backendBaseUrl}api/clients?page=${pageNo}`;
      },
      getAllSelf(pageNo?: number) {
        return !pageNo
          ? `${backendBaseUrl}api/clients?SC=1&page=1`
          : `${backendBaseUrl}api/clients?SC=1&page=${pageNo}`;
      },

      updateClients(id: string) {
        return `${backendBaseUrl}api/clients/by-client-no/${id}`; //put method
      },
      deleteClients(id: string) {},
      assignWork() {
        return `${backendBaseUrl}api/attendance/assignWork`;
      },
      request: {
        uniform: {
          delete(id: string) {
            return `${backendBaseUrl}api/uniforms/${id}`;
          },
          update(id: string) {
            return `${backendBaseUrl}api/uniforms/docId/${id}`; //put
          },
        },
        idcard: {
          get: `${backendBaseUrl}api/idcard/get`,
          update: `${backendBaseUrl}api/idcard/updateIdCard`,
        },
        leaves: {
          update(id: string) {
            return `${backendBaseUrl}api/leaves/docId/${id}`;
          },
          delete(id: string) {
            return `${backendBaseUrl}api/leaves/${id}`;
          },
        },
      },
      clients: {
        delete(id: string) {
          return `${backendBaseUrl}api/clients/by-client-no/${id}`; //delete
        },
      },

      employees: {
        add() {
          return `${backendBaseUrl}api/employees`; //post method
        },
      },
    },
  },
};
