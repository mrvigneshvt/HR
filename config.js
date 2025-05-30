export const configFile = {
  colorGreen: '#238c58',
  areYouInOFfice: true,
  api: {
    credentials: {
      key: 'iaus787sadfsdf837asdsad8223e',
    },
    get baseUrl() {
      return 'http://192.168.0.121:5656';
    },
    fetchEmpData(id) {
      return `${this.baseUrl}/api/v1/get/getEmpDetails/${id}/${this.credentials.key}`;
    },
    postOtp() {
      return `${this.baseUrl}/api/v1/post/otpGen/${this.credentials.key}`;
    },
    verifyOtp() {
      return `${this.baseUrl}/api/v1/post/verifyOtp/${this.credentials.key}`;
    },
    verifyToken() {
      return `${this.baseUrl}/api/v1/get/verifyToken`;
    },
  },
};
