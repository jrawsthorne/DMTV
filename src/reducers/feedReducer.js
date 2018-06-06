import _ from 'lodash';
import * as types from '../actions/types';

const initialState = {
  created: {},
};

/* array of strngs to find full posts */
const feedIdsList = (state = [], action) => {
  switch (action.type) {
    case types.FETCH_POSTS_FULFILLED:
      return _.uniq(state.concat([...action.payload.posts.map(post => `@${post.author}/${post.permlink}`)]));
    default:
      return state;
  }
};

/* set list of ids if posts fetched successfully */
const feedCategory = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_POSTS_PENDING:
      if (action.meta.lastPost) {
        return {
          ...state,
          fetching: false,
          loaded: true,
          failed: false,
          list: feedIdsList(state.list, action),
        };
      }
      return {
        ...state,
        fetching: true,
        loaded: false,
        failed: false,
        list: feedIdsList(state.list, action),
      };
    case types.FETCH_POSTS_FULFILLED:
      return {
        ...state,
        fetching: false,
        loaded: true,
        failed: false,
        /* has more if number of posts doesn't equal count from db */
        hasMore: feedIdsList(state.list, action).length !== action.payload.count || false,
        list: feedIdsList(state.list, action),
      };
    case types.FETCH_POSTS_REJECTED:
      return {
        ...state,
        fetching: false,
        loaded: true,
        failed: true,
        hasMore: false,
      };
    default:
      return state;
  }
};

const feedSortBy = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_POSTS_FULFILLED:
    case types.FETCH_POSTS_PENDING:
    case types.FETCH_POSTS_REJECTED: {
      let key = action.meta.mediaType;
      if (action.meta.tmdbid) key += action.meta.tmdbid;
      if (action.meta.seasonNum) key += action.meta.seasonNum;
      if (action.meta.episodeNum) key += action.meta.episodeNum;
      return {
        ...state,
        [key]: feedCategory(state[key], action),
      };
    }
    default:
      return state;
  }
};

const feed = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_POSTS_FULFILLED:
    case types.FETCH_POSTS_PENDING:
    case types.FETCH_POSTS_REJECTED:
      return {
        ...state,
        [action.meta.sortBy]: feedSortBy(state[action.meta.sortBy], action),
      };
    default:
      return state;
  }
};

export default feed;
