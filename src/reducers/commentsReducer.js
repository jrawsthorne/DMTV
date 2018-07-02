import _ from 'lodash';
import * as types from '../actions/types';
import { arrayToObject } from '../helpers/mediaHelpers';

const initialState = {
  childrenById: {},
  comments: {},
  pendingVotes: [],
  fetching: [],
};

const childrenById = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_REPLIES_FULFILLED:
      return {
        ...state,
        [action.meta.id]: action.payload.map(comment => comment.id),
      };
    default:
      return state;
  }
};

const commentsData = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_REPLIES_FULFILLED:
      return {
        ...state,
        ...arrayToObject(action.payload, 'id'),
      };
    default:
      return state;
  }
};

const fetching = (state = initialState.fetching, action) => {
  switch (action.type) {
    case types.FETCH_REPLIES_PENDING:
      return [...state, action.meta.id];
    case types.FETCH_REPLIES_FULFILLED:
    case types.FETCH_REPLIES_REJECTED:
      return _.without(state, action.meta.id);
    default:
      return state;
  }
};

const comments = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_REPLIES_PENDING:
    case types.FETCH_REPLIES_FULFILLED:
    case types.FETCH_REPLIES_REJECTED:
      return {
        ...state,
        comments: commentsData(state.comments, action),
        childrenById: childrenById(state.childrenById, action),
        fetching: fetching(state.fetching, action),
      };
    case types.FETCH_REPLY_FULFILLED:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.id]: action.payload,
        },
      };
    default:
      return state;
  }
};

export default comments;
