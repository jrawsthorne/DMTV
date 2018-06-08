import Cookie from 'js-cookie';
import axios from 'axios';
import steemConnectAPI from '../apis/steemConnectAPI';
import { LOGIN, LOGOUT, FETCH_USER_RATINGS, FETCH_USER_SUBSCRIPTIONS } from './types';

export const login = () => ({
  type: LOGIN,
  /* server side login */
  payload: axios.post(`${process.env.API_URL}/users/login`, { accessToken: Cookie.get('access_token') }).then((res) => {
    /* add app token to cookies */
    Cookie.set('token', res.data.token);
    return res.data;
  }).catch(() => {
    /* remove the tokens if there's an error logging in */
    Cookie.remove('access_token');
    Cookie.remove('token');
    throw new Error('Login failed');
  }),
  meta: {
    globalError: 'Login failed',
  },
});

export const logout = () => (dispatch) => {
  /* remove both tokens used to authenticate */
  steemConnectAPI.revokeToken();
  Cookie.remove('access_token');
  Cookie.remove('token');
  dispatch({
    type: LOGOUT,
  });
};

/* fetch all the ratings for the current user */
export const fetchUserRatings = () => ({
  type: FETCH_USER_RATINGS,
  /* add authorization header */
  payload: axios.get(`${process.env.API_URL}/users/ratings`, { headers: { Authorization: `Bearer ${Cookie.get('token')}` } }).then(res => res.data),
  meta: { globalError: 'Error fetching ratings' },
});

/* fetch all the shows and movies the user has subscribed to */
export const fetchUserSubscriptions = () => ({
  type: FETCH_USER_SUBSCRIPTIONS,
  /* add authorization header */
  payload: axios.get(`${process.env.API_URL}/users/subscriptions`, { headers: { Authorization: `Bearer ${Cookie.get('token')}` } }).then(res => res.data),
  meta: { globalError: 'Error fetching subscriptions' },
});

export default login;
