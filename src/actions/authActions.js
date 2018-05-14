import Cookie from 'js-cookie';
import axios from 'axios';
import steemConnectAPI from '../apis/steemConnectAPI';
import { LOGIN, LOGOUT } from './types';

export const login = () => ({
  type: LOGIN,
  payload: axios.get(`${process.env.API_URL}/users/login`).then(res => res.data).catch(() => {
    Cookie.remove('access_token');
  }),
  meta: {
    globalError: 'Login failed',
  },
});

export const logout = () => (dispatch) => {
  steemConnectAPI.revokeToken();
  Cookie.remove('access_token');
  dispatch({
    type: LOGOUT,
  });
};

export default login;
