import _ from 'lodash';
import { message } from 'antd';
import {
  LOGIN_PENDING,
  LOGIN_FULFILLED,
  LOGIN_REJECTED,
  LOGOUT,
  USER_RATE_CHANGE_FULFILLED,
  USER_RATE_CHANGE_PENDING,
  USER_RATE_CHANGE_REJECTED,
} from '../actions/types';

const initialState = {
  isAuthenticated: false,
  loaded: false,
  failed: false,
  fetching: false,
  user: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_PENDING:
      return {
        ...state,
        isAuthenticated: false,
        loaded: false,
        failed: false,
        fetching: true,
        user: {},
      };
    case LOGIN_FULFILLED:
      return {
        ...state,
        isAuthenticated: true,
        loaded: true,
        failed: false,
        fetching: false,
        user: {
          ...action.payload.account,
          ratings: {
            scores: action.payload.account.ratings.scores,
            loaded: true,
            failed: false,
            fetching: false,
          },
        },
      };
    case LOGIN_REJECTED:
      return {
        isAuthenticated: false,
        loaded: true,
        failed: true,
        fetching: false,
        user: {},
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        loaded: true,
        failed: false,
        fetching: false,
        user: {},
      };
    case USER_RATE_CHANGE_PENDING:
      return {
        ...state,
        user: {
          ...state.user,
          ratings: {
            ..._.get(state, 'user.ratings'),
            fetching: true,
            loaded: false,
            failed: false,
          },
        },
      };
    case USER_RATE_CHANGE_FULFILLED: {
      const {
        seasonNum, episodeNum, tmdbid, mediaType, value,
      } = action.meta;
      message.destroy();
      if (value === 0) {
        message.success('Rating removed successfully', 0.5);
      } else {
        message.success('Rated successfully', 0.5);
      }
      if (!_.isEmpty(_.get(state, 'user.ratings.scores', []))) {
        const query = { tmdbid: parseInt(tmdbid, 10), mediaType };
        if (seasonNum) query.seasonNum = parseInt(seasonNum, 10);
        if (episodeNum) query.episodeNum = parseInt(episodeNum, 10);
        const currentRating = _.find(state.user.ratings.scores, query);
        if (currentRating) {
          const ratings = _.filter(state.user.ratings.scores, (rating => rating !== currentRating));
          if (!_.isEmpty(action.payload)) ratings.push(action.payload);
          return {
            ...state,
            user: {
              ...state.user,
              ratings: {
                ...state.user.ratings,
                fetching: false,
                loaded: true,
                failed: false,
                scores: ratings,
              },
            },
          };
        }
      }
      return {
        ...state,
        user: {
          ...state.user,
          ratings: {
            ..._.get(state, 'user.ratings'),
            fetching: false,
            loaded: true,
            failed: false,
            scores: [
              ..._.get(state, 'user.ratings.scores'),
              action.payload,
            ],
          },
        },
      };
    }
    case USER_RATE_CHANGE_REJECTED:
      return {
        ...state,
        user: {
          ...state.user,
          ratings: {
            ..._.get(state, 'user.ratings'),
            fetching: false,
            loaded: true,
            failed: true,
          },
        },
      };
    default:
      return state;
  }
};
