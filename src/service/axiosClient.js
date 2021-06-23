import axios from 'axios';
import queryString from 'query-string';
import { ACCESS_TOKEN } from '../constants/Constants';
import { auth } from '../components/Auth/Auth';

const cleanParam = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === null || obj[k] === undefined) {
      delete obj[k];
    }
  });
  return obj;
};

axios.interceptors.request.use(
  function (config) {
    const newConfig = {
      ...config,
      paramsSerializer: (params) =>
        queryString.stringify(cleanParam(params), { arrayFormat: 'repeat' }),
      baseURL: process.env.REACT_APP_HOST_API,
      // withCredentials: true,
      headers: {
        ...config.headers,
        Pragma: 'no-cache'
      }
    };

    // Add auth token
    if (localStorage.getItem(ACCESS_TOKEN)) {
      newConfig.headers.Authorization = `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`;
    }

    return newConfig;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  (error) => {
    if (error.response && error.response.status) {
      if (error.response.status === 401) {
        auth.redirectToLoginPage();
      }
      //... handle other statuses
      return Promise.reject(error.response);
    } else {
      return Promise.reject(error);
    }
  }
);

export default axios;
