import { message } from 'antd';
import _ from 'lodash';
import * as types from '../actions/types';

const initialState = {
  loaded: false,
  failed: false,
  fetching: false,
  items: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_USER_RATINGS_FULFILLED:
      return {
        ...state,
        fetching: false,
        loaded: true,
        failed: false,
        items: [
          ...state.items,
          ...action.payload,
        ],
      };
    case types.FETCH_USER_RATINGS_PENDING:
      return {
        ...state,
        fetching: true,
        loaded: false,
        failed: false,
      };
    case types.FETCH_USER_RATINGS_REJECTED:
      return {
        ...state,
        fetching: false,
        loaded: true,
        failed: true,
      };
    case types.USER_RATE_CHANGE_PENDING:
      return {
        ...state,
        fetching: true,
        loaded: false,
        failed: false,
      };
    case types.USER_RATE_CHANGE_FULFILLED: {
      const {
        seasonNum, episodeNum, tmdbid, mediaType, value,
      } = action.meta;
      message.destroy();
      if (value === 0) {
        message.success('Rating removed successfully', 0.5);
      } else {
        message.success('Rated successfully', 0.5);
      }
      if (!_.isEmpty(state.items)) {
        const query = { tmdbid: parseInt(tmdbid, 10), mediaType };
        if (seasonNum) query.seasonNum = parseInt(seasonNum, 10);
        if (episodeNum) query.episodeNum = parseInt(episodeNum, 10);
        const currentRating = _.find(state.items, query);
        if (currentRating) {
          const ratings = _.filter(state.items, (rating => rating !== currentRating));
          if (!_.isEmpty(action.payload)) ratings.push(action.payload);
          return {
            ...state,
            fetching: false,
            loaded: true,
            failed: false,
            items: ratings,
          };
        }
      }
      return {
        ...state,
        fetching: false,
        loaded: true,
        failed: false,
        items: [
          ...state.items,
          action.payload,
        ],
      };
    }
    case types.USER_RATE_CHANGE_REJECTED:
      return {
        ...state,
        fetching: false,
        loaded: true,
        failed: true,
      };
    default:
      return state;
  }
};