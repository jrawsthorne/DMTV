import _ from 'lodash';
import * as types from '../actions/types';

const initialState = {
  items: {},
  itemStates: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_ACTOR_PENDING:
      return {
        ...state,
        itemStates: {
          ...state.itemStates,
          [action.meta.id]: {
            loaded: false,
            failed: false,
            fetching: true,
          },
        },
      };
    case types.FETCH_ACTOR_FULFILLED:
      return {
        ...state,
        items: {
          ...state.items,
          [action.meta.id]: action.payload,
        },
        itemStates: {
          ...state.itemStates,
          [action.meta.id]: {
            loaded: true,
            failed: false,
            fetching: false,
          },
        },
      };
    case types.FETCH_ACTOR_REJECTED:
      return {
        ...state,
        itemStates: {
          ...state.itemStates,
          [action.meta.id]: {
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

export const getPerson = (state, personId) => _.get(state, `${personId}`, {});
export const getPersonState = (state, personId) => ({
  fetching: _.get(state, `${personId}.fetching`, false),
  loaded: _.get(state, `${personId}.loaded`, false),
  failed: _.get(state, `${personId}.failed`, false),
});
