import * as types from '../actions/types';

const initialState = {
  isAuthenticated: false,
  loaded: false,
  failed: false,
  fetching: false,
  user: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_PENDING:
      return {
        ...state,
        isAuthenticated: false,
        loaded: false,
        failed: false,
        fetching: true,
        user: {},
      };
    case types.LOGIN_FULFILLED:
      return {
        ...state,
        isAuthenticated: true,
        loaded: true,
        failed: false,
        fetching: false,
        user: action.payload.account,
      };
    case types.LOGIN_REJECTED:
      return {
        isAuthenticated: false,
        loaded: true,
        failed: true,
        fetching: false,
        user: {},
      };
    case types.LOGOUT:
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
