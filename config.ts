const backendConnection = 'https';
const backendDomain = 'sdce.lyzooapp.co.in';
const backendPort = '31313';
const backendBaseUrl = `${backendConnection}://${backendDomain}:${backendPort}/`;

export const configFile = {
  colorGreen: '#238c58',
  color: {
    sdce: {
      bg: '',
      cards: '',
      stack: '',
    },
    sq: {
      bg: '',
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
      app: {
        uniform: `${backendBaseUrl}api/uniforms/phone`,
        squniform: `${backendBaseUrl}api/uniforms/phone?prefix=SQ`,

        leave: `${backendBaseUrl}api/leaves/phone`,
        sqleave: `${backendBaseUrl}api/leaves/phone?prefix=SQ`,

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
