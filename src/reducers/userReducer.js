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
