export const configFile = {
  colorGreen: '#238c58',
  areYouInOFfice: false,
  api: {
    credentials: {
      key: 'iaus787sadfsdf837asdsad8223e',
    },
    baseUrl: 'http://192.168.1.10:5656',
    fetchEmpData(id) {
      return `${this.baseUrl}/api/v1/get/getEmpDetails/${id}/${this.credentials.key}`;
    },
  },
};
