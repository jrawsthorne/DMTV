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
          fetchingMore: true,
        };
      }
      return {
        ...state,
        fetching: true,
        loaded: false,
        failed: false,
      };
    case types.FETCH_POSTS_FULFILLED: {
      if (action.meta.lastPost) {
        return {
          ...state,
          fetchingMore: false,
          list: feedIdsList(state.list, action),
          hasMore: !!(feedIdsList(state.list, action).length !== action.payload.count
          && !_.isEmpty(action.payload.posts)),
        };
      }
      return {
        ...state,
        fetching: false,
        loaded: true,
        failed: false,
        /* has more if number of posts doesn't equal count from db */
        hasMore: !!(feedIdsList(state.list, action).length !== action.payload.count
          && !_.isEmpty(action.payload.posts)),
        list: feedIdsList(state.list, action),
      };
    }
    case types.FETCH_POSTS_REJECTED:
      return {
        ...state,
        fetching: false,
        fetchingMore: false,
        loaded: true,
        failed: true,
        hasMore: false,
      };
    default:
      return state;
  }
};

const feedEpisode = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_POSTS_FULFILLED:
    case types.FETCH_POSTS_PENDING:
    case types.FETCH_POSTS_REJECTED: {
      const {
        meta: {
          category: {
            episodeNum,
          },
        },
      } = action;
      return {
        ...state,
        [episodeNum]: feedCategory(state[episodeNum], action),
      };
    }
    default:
      return state;
  }
};

const feedEpisodes = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_POSTS_FULFILLED:
    case types.FETCH_POSTS_PENDING:
    case types.FETCH_POSTS_REJECTED:
      return {
        ...state,
        episodes: feedEpisode(state.episodes, action),
      };
    default:
      return state;
  }
};

const feedSeason = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_POSTS_FULFILLED:
    case types.FETCH_POSTS_PENDING:
    case types.FETCH_POSTS_REJECTED: {
      const {
        meta: {
          category: {
            seasonNum, episodeNum,
          },
        },
      } = action;
      if (!episodeNum) {
        return {
          ...state,
          [seasonNum]: feedCategory(state[seasonNum], action),
        };
      }
      return {
        ...state,
        [seasonNum]: feedEpisodes(state[seasonNum], action),
      };
    }
    default:
      return state;
  }
};

const feedSeasons = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_POSTS_FULFILLED:
    case types.FETCH_POSTS_PENDING:
    case types.FETCH_POSTS_REJECTED:
      return {
        ...state,
        seasons: feedSeason(state.seasons, action),
      };
    default:
      return state;
  }
};

const feedTmdbid = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_POSTS_FULFILLED:
    case types.FETCH_POSTS_PENDING:
    case types.FETCH_POSTS_REJECTED: {
      const {
        meta: {
          category: {
            tmdbid, type: mediaType, seasonNum, episodeNum,
          },
        },
      } = action;
      if (mediaType === 'movie' || (mediaType === 'show' && !seasonNum && !episodeNum)) {
        return {
          ...state,
          [tmdbid]: feedCategory(state[tmdbid], action),
        };
      }
      return {
        ...state,
        [tmdbid]: feedSeasons(state[tmdbid], action),
      };
    }
    default:
      return state;
  }
};

const feedSortBy = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_POSTS_FULFILLED:
    case types.FETCH_POSTS_PENDING:
    case types.FETCH_POSTS_REJECTED: {
      if (_.isObject(action.meta.category)) {
        if (action.meta.category.type) {
          return {
            ...state,
            [action.meta.category.type]:
              feedTmdbid(state[action.meta.category.type], action),
          };
        }
        if (action.meta.category.author) {
          return {
            ...state,
            [action.meta.category.author]: feedCategory(state[action.meta.category.author], action),
          };
        }
      }
      return {
        ...state,
        [action.meta.category]: feedCategory(state[action.meta.category], action),
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

export const getFeed = state => state;
