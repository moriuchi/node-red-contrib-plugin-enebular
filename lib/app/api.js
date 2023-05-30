const axios = require('axios');

const api = axios.create({
  baseURL: 'https://enebular.com/api/v1',
  responseType: 'json'
});


export default api;
