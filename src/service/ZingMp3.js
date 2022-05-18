import axios from 'axios';
import queryString from 'query-string';
import { sha256Hex, hmacSha512Hex } from './crypto';

const ZING_MP3_HOST = 'https://zingmp3.vn';
const API_KEY = '88265e23d4284f25963e6eedac8fbfa3';
const SECRET_KEY = '2aa2d1c561e809b267f3638c4a307aab';

axios.interceptors.request.use(
  function (config) {
    return {
      ...config,
      paramsSerializer: (params) =>
        queryString.stringify({ ...params, apiKey: API_KEY }, { arrayFormat: 'repeat' }),
      baseURL: ZING_MP3_HOST,
      headers: {
        ...config.headers,
        Pragma: 'no-cache'
      }
    };
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);
