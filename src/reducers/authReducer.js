import { LOGIN_PENDING, LOGIN_FULFILLED, LOGIN_REJECTED, LOGOUT } from '../actions/types';

const initialState = {
  isAuthenticated: false,
  loaded: false,
  failed: false,
  fetching: false,
  user: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_PENDING:
      return {
        ...state,
        isAuthenticated: false,
        loaded: false,
        failed: false,
        fetching: true,
        user: {},
      };
    case LOGIN_FULFILLED:
      return {
        ...state,
        isAuthenticated: true,
        loaded: true,
        failed: false,
        fetching: false,
        user: action.payload.account,
      };
    case LOGIN_REJECTED:
      return {
        isAuthenticated: false,
        loaded: true,
        failed: true,
        fetching: false,
        user: {},
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        loaded: true,
        failed: false,
        fetching: false,
        user: {},
      };
    default:
      return state;
  }
};
