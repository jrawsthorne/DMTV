import _ from 'lodash';
import * as types from '../actions/types';

const initialState = {
  loaded: false,
  failed: false,
  fetching: false,
  items: {},
  itemStates: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_POSTS_PENDING:
      return {
        ...state,
        loaded: false,
        failed: false,
        fetching: true,
      };
    case types.FETCH_POSTS_FULFILLED:
      return {
        ...state,
        loaded: true,
        failed: false,
        fetching: false,
        items: {
          ...state.items,
          ...action.payload,
        },
        itemStates: {
          ...state.itemStates,
          ..._.mapValues(action.payload, () => ({
            loaded: true,
            failed: false,
            fetching: false,
          })),
        },
      };
    case types.FETCH_POSTS_REJECTED:
      return {
        ...state,
        loaded: true,
        failed: true,
        fetching: false,
      };
    case types.FETCH_POST_PENDING:
      return {
        ...state,
        itemStates: {
          ...state.itemStates,
          [`@${action.meta.author}/${action.meta.permlink}`]: {
            ..._.get(state.itemStates, `@${action.meta.author}/${action.meta.permlink}`),
            loaded: false,
            failed: false,
            fetching: true,
          },
        },
      };
    case types.FETCH_POST_FULFILLED:
      return {
        ...state,
        items: {
          ...state.items,
          [`@${action.meta.author}/${action.meta.permlink}`]: action.payload,
        },
        itemStates: {
          ...state.itemStates,
          [`@${action.meta.author}/${action.meta.permlink}`]: {
            ..._.get(state.itemStates, `@${action.meta.author}/${action.meta.permlink}`),
            loaded: true,
            failed: false,
            fetching: false,
          },
        },
      };
    case types.FETCH_POST_REJECTED:
      return {
        ...state,
        itemStates: {
          ...state.itemStates,
          [`@${action.meta.author}/${action.meta.permlink}`]: {
            ..._.get(state.itemStates, `@${action.meta.author}/${action.meta.permlink}`),
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