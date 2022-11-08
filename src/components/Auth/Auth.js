import { ACCESS_TOKEN } from '../../constants/Constants';
import axiosClient from '../../service/axiosClient';
import Toast from '../Toast/Toast';
import { ROLE_TABLE } from '../../constants/Constants';

class Auth {
  constructor() {
    this.userInfo = null;
  }

  isAuthenticated = () => {
    const access_token = localStorage.getItem(ACCESS_TOKEN);
    return !!access_token;
  };

  login = ({ username, password }, successCallback, failCallback) => {
    const data = {
      username,
      password
    };
    axiosClient
      .post('/auth/login', data)
      .then((res) => {
        localStorage.setItem(ACCESS_TOKEN, res.data[ACCESS_TOKEN]);
        successCallback();
      })
      .catch((err) => {
        failCallback(err.data ? err.data : err);
      });
  };

  logoutOld = () => {
    axiosClient
      .post('/auth/logout')
      .then((res) => {
        localStorage.removeItem(ACCESS_TOKEN);
        window.location = '/';
      })
      .catch((err) => {
        Toast.error(err);
      });
  };

  logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    window.location = '/';
  };

  getMe = () => {
    return axiosClient.get('/auth/me');
  };

  redirectToLoginPage = (response) => {
    if (localStorage.getItem(ACCESS_TOKEN)) {
      Toast.error('Access token has been expired!');
      localStorage.removeItem(ACCESS_TOKEN);
    } else if (response && response.data) {
      Toast.error(response.data.message);
    } else {
      Toast.info('You need to login first!');
    }
    window.location.hash = '/login';
  };

  /**
   * Check xem mảng roles có tồn tại role nào có quyền truy cập path hay ko
   * @param {string[]} roles - Array of role
   * @param {string} path - URL
   */
  rolesHasPermission = (roles, path) => {
    if (!ROLE_TABLE[path]) return true;
    for (let i = 0; i < roles.length; i++) {
      if (ROLE_TABLE[path].includes(roles[i])) return true;
    }
    // Dùng forEach: bất đồng bộ nên ko được nhé!
    // Nó sẽ return false trước khi chạy vào trong forEach
    // roles.forEach(role => {
    //   if (ROLE_TABLE[path].includes(role)) return true;
    // });
    return false;
  };
}

export let auth = new Auth();
