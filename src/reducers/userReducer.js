import _ from 'lodash';
import { FETCH_ACCOUNT_PENDING, FETCH_ACCOUNT_FULFILLED, FETCH_ACCOUNT_REJECTED } from '../actions/types';

const initialState = {
  users: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACCOUNT_PENDING:
      return {
        ...state,
        users: {
          ...state.users,
          [action.meta.username]: {
            loaded: false,
            failed: false,
            fetching: true,
          },
        },
      };
    case FETCH_ACCOUNT_FULFILLED:
      return {
        ...state,
        users: {
          ...state.users,
          [action.meta.username]: {
            ...action.payload,
            loaded: true,
            failed: false,
            fetching: false,
          },
        },
      };
    case FETCH_ACCOUNT_REJECTED:
      return {
        ...state,
        users: {
          ...state.users,
          [action.meta.username]: {
            loaded: true,
            failed: true,
            fetching: false,
          },
        },
      };
    default:
      return state;
  }
};

export const getUser = (state, username) => _.get(state, `${username}`);
export const getUserState = (state, username) => ({
  fetching: _.get(state, `${username}.fetching`, false),
  loaded: _.get(state, `${username}.loaded`, false),
  failed: _.get(state, `${username}.failed`, false),
});
