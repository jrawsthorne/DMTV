import Cookie from 'js-cookie';
import axios from 'axios';
import steemConnectAPI from '../apis/steemConnectAPI';
import { LOGIN, LOGOUT } from './types';

export const login = () => ({
  type: LOGIN,
  payload: axios.post(`${process.env.API_URL}/users/login`, { accessToken: Cookie.get('access_token') }).then((res) => {
    Cookie.set('token', res.data.token);
    return res.data.user;
  }),
  meta: {
    globalError: 'Login failed',
  },
});

export const logout = () => (dispatch) => {
  steemConnectAPI.revokeToken();
  Cookie.remove('access_token');
  Cookie.remove('token');
  dispatch({
    type: LOGOUT,
  });
};

export default login;
