import Cookie from 'js-cookie';
import steemConnectAPI from '../apis/steemConnectAPI';

export const login = () => ({
  type: 'LOGIN',
  payload: steemConnectAPI.me(),
  meta: {
    globalError: 'Login failed',
  },
});

export const logout = () => (dispatch) => {
  steemConnectAPI.revokeToken();
  Cookie.remove('access_token');
  dispatch({
    type: 'LOGOUT',
  });
};

export default login;
