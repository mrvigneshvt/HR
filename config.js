export const configFile = {
  colorGreen: '#238c58',
  api: {
    credentials: {
      key: 'iaus787sadfsdf837asdsad8223e',
    },
    baseUrl: 'http://192.168.0.116:5656',
    fetchEmpData(id) {
      return `${this.baseUrl}/api/v1/get/getEmpDetails/${id}/${this.credentials.key}`;
    },
  },
};
