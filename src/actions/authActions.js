import Cookie from 'js-cookie';
import axios from 'axios';
import steemConnectAPI from '../apis/steemConnectAPI';
import { LOGIN, LOGOUT, FETCH_USER_RATINGS, FETCH_USER_SUBSCRIPTIONS } from './types';

export const login = () => ({
  type: LOGIN,
  /* server side login */
  payload: axios.post(`${process.env.API_URL}/users/login`, { accessToken: Cookie.get('access_token') }).then((res) => {
    /* all future api requests send the authorization token */
    axios.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
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
  payload: axios.get(`${process.env.API_URL}/users/ratings`).then(res => res.data),
  meta: { globalError: 'Error fetching ratings' },
});

/* fetch all the shows and movies the user has subscribed to */
export const fetchUserSubscriptions = () => ({
  type: FETCH_USER_SUBSCRIPTIONS,
  payload: axios.get(`${process.env.API_URL}/users/subscriptions`).then(res => res.data),
  meta: { globalError: 'Error fetching subscriptions' },
});

export default login;
