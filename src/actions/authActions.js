import Cookie from 'js-cookie';
import steemConnectAPI from '../apis/steemConnectAPI';
import { LOGIN, LOGOUT } from './types';

export const login = () => ({
  type: LOGIN,
  payload: steemConnectAPI.me().catch(() => {
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
