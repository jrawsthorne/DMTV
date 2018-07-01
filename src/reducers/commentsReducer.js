import * as types from '../actions/types';
import { arrayToObject } from '../helpers/mediaHelpers';

const initialState = {
  childrenById: {},
  comments: {},
  pendingVotes: [],
  fetching: false,
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
      return true;
    case types.FETCH_REPLIES_FULFILLED:
    case types.FETCH_REPLIES_REJECTED:
      return false;
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
    default:
      return state;
  }
};

export default comments;
