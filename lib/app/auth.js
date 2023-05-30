import api from './api.js';

const login = (param) => {
  const data = {
    email: param.email,
    password: param.password
  };

  return api.post('/auth/login', data)
  .then((result) => {
    const resultData = result.data;
    api.defaults.headers.common['Authorization'] = `Bearer  ${resultData.token}`;
  });
};


export {
  login
}
