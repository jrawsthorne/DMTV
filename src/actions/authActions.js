import Cookie from 'js-cookie';
import axios from 'axios';
import steemConnectAPI from '../apis/steemConnectAPI';
import { LOGIN, LOGOUT, FETCH_USER_RATINGS, FETCH_USER_SUBSCRIPTIONS } from './types';

export const login = () => ({
  type: LOGIN,
  payload: axios.post(`${process.env.API_URL}/users/login`, { accessToken: Cookie.get('access_token') }).then((res) => {
    axios.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
    return res.data;
  }).catch(() => {
    Cookie.remove('access_token');
    Cookie.remove('token');
    throw new Error('Login failed');
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

export const fetchUserRatings = () => ({
  type: FETCH_USER_RATINGS,
  payload: axios.get(`${process.env.API_URL}/users/ratings`).then(res => res.data),
  meta: { globalError: 'Error fetching ratings' },
});

export const fetchUserSubscriptions = () => ({
  type: FETCH_USER_SUBSCRIPTIONS,
  payload: axios.get(`${process.env.API_URL}/users/subscriptions`).then(res => res.data),
  meta: { globalError: 'Error fetching subscriptions' },
});

export default login;
