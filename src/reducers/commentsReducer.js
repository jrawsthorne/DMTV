import _ from 'lodash';
import * as types from '../actions/types';
import { arrayToObject } from '../helpers/mediaHelpers';

const initialState = {
  childrenById: {},
  comments: {},
  pendingVotes: [],
  pendingComments: [],
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
    case types.FETCH_REPLIES_PENDING: {
      if (!action.meta.reload) {
        return [...state, action.meta.id];
      }
      return state;
    }
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
    case types.SUBMIT_COMMENT_PENDING:
      return {
        ...state,
        pendingComments: [...state, action.meta.parentId],
      };
    case types.SUBMIT_COMMENT_FULFILLED:
    case types.SUBMIT_COMMENT_REJECTED:
      return {
        ...state,
        pendingComments: _.without(state, action.meta.parentId),
      };
    default:
      return state;
  }
};

export default comments;
