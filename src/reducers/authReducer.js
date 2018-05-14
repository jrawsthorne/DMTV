import _ from 'lodash';
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
        seasonNum, episodeNum, tmdbid, mediaType,
      } = action.meta;
      if (!_.isEmpty(_.get(state, 'user.ratings.scores', []))) {
        const currentRating = state.user.ratings.scores.find((rating) => {
          if (seasonNum) {
            if (episodeNum) {
              return (
                rating.tmdbid === parseInt(tmdbid, 10) &&
                  rating.mediaType === mediaType &&
                  rating.seasonNum === parseInt(seasonNum, 10) &&
                  rating.episodeNum === parseInt(episodeNum, 10));
            }
            return (
              rating.tmdbid === parseInt(tmdbid, 10) &&
                rating.mediaType === mediaType &&
                rating.seasonNum === parseInt(seasonNum, 10));
          }
          return (rating.tmdbid === parseInt(tmdbid, 10) && rating.mediaType === mediaType);
        });
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
