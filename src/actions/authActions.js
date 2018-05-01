import steemConnectAPI from '../apis/steemConnectAPI';

export const login = () => ({
  type: 'LOGIN',
  payload: steemConnectAPI.me(),
  meta: {
    globalError: 'Login failed',
  },
});

export default login;
