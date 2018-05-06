import _ from 'lodash';
import * as types from '../actions/types';

const initialState = {
  items: {},
  itemStates: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_MOVIE_PENDING:
    case types.FETCH_SHOW_PENDING:
      return {
        ...state,
        itemStates: {
          ...state.itemStates,
          [action.meta.type]: {
            ..._.get(state, `itemStates[${action.meta.type}]`),
            [action.meta.id]: {
              ..._.get(state, `itemStates[${action.meta.type}][${action.meta.id}]`),
              loaded: false,
              failed: false,
              fetching: true,
            },
          },
        },
      };
    case types.FETCH_MOVIE_FULFILLED:
    case types.FETCH_SHOW_FULFILLED:
      return {
        ...state,
        items: {
          ...state.items,
          [action.meta.type]: {
            ..._.get(state, `items[${action.meta.type}]`),
            [action.meta.id]: {
              ..._.get(state, `items[${action.meta.type}][${action.meta.id}]`),
              ...action.payload,
            },
          },
        },
        itemStates: {
          ...state.itemStates,
          [action.meta.type]: {
            ..._.get(state, `itemStates[${action.meta.type}]`),
            [action.meta.id]: {
              ..._.get(state, `itemStates[${action.meta.type}][${action.meta.id}]`),
              loaded: true,
              failed: false,
              fetching: false,
            },
          },
        },
      };
    case types.FETCH_MOVIE_REJECTED:
    case types.FETCH_SHOW_REJECTED:
      return {
        ...state,
        itemStates: {
          ...state.itemStates,
          [action.meta.type]: {
            ..._.get(state, `itemStates[${action.meta.type}]`),
            [action.meta.id]: {
              ..._.get(state, `itemStates[${action.meta.type}][${action.meta.id}]`),
              loaded: true,
              failed: true,
              fetching: false,
            },
          },
        },
      };
    case types.FETCH_SEASON_PENDING:
    case types.FETCH_EPISODE_PENDING:
      return {
        ...state,
        itemStates: {
          ...state.itemStates,
          shows: {
            ..._.get(state, 'itemStates.shows'),
            [action.meta.id]: {
              ..._.get(state, `itemStates.shows[${action.meta.id}]`),
              loaded: false,
              failed: false,
              fetching: true,
              seasons: {
                ..._.get(state, `itemStates.shows[${action.meta.id}].seasons`),
                [action.meta.seasonNum]: {
                  loaded: false,
                  failed: false,
                  fetching: true,
                },
              },
            },
          },
        },
      };
    case types.FETCH_SEASON_FULFILLED:
    case types.FETCH_EPISODE_FULFILLED:
      return {
        ...state,
        items: {
          ...state.items,
          shows: {
            ..._.get(state, 'items.shows'),
            [action.meta.id]: {
              ..._.get(state, `items.shows[${action.meta.id}]`),
              ...action.payload,
              seasons: _.mapValues(
                action.payload.seasons,
                season => ({
                  ...action.payload.seasons[season.season_number],
                  ..._.get(state, `items.shows[${action.meta.id}].seasons[${season.season_number}]`),
                }),
              ),
            },
          },
        },
        itemStates: {
          ...state.itemStates,
          shows: {
            ..._.get(state, 'itemStates.shows'),
            [action.meta.id]: {
              ..._.get(state, `itemStates.shows[${action.meta.id}]`),
              loaded: true,
              failed: false,
              fetching: false,
              seasons: {
                ..._.get(state, `itemStates.shows[${action.meta.id}].seasons`),
                [action.meta.seasonNum]: {
                  loaded: true,
                  failed: false,
                  fetching: false,
                  episodes: _.mapValues(
                    action.payload.seasons[action.meta.seasonNum].episodes,
                    () => ({
                      loaded: true,
                      failed: false,
                      fetching: false,
                    }),
                  ),
                },
              },
            },
          },
        },
      };
    case types.FETCH_EPISODE_REJECTED:
      return {
        ...state,
        itemStates: {
          ...state.itemStates,
          shows: {
            ..._.get(state, 'itemStates.shows'),
            [action.meta.id]: {
              ..._.get(state, `itemStates.shows[${action.meta.id}]`),
              seasons: {
                ..._.get(state, `itemStates.shows[${action.meta.id}].seasons`),
                [action.meta.seasonNum]: {
                  episodes: {
                    ..._.get(state, `itemStates.shows[${action.meta.id}].seasons[action.meta.seasonNum].episodes`),
                    [action.meta.episodeNum]: {
                      loaded: true,
                      failed: true,
                      fetching: false,
                    },
                  },
                },
              },
            },
          },
        },
      };
    case types.FETCH_SEASON_REJECTED:
      return {
        ...state,
        itemStates: {
          ...state.itemStates,
          shows: {
            ..._.get(state, 'itemStates.shows'),
            [action.meta.id]: {
              ..._.get(state, `itemStates.shows[${action.meta.id}]`),
              seasons: {
                ..._.get(state, `itemStates.shows[${action.meta.id}].seasons`),
                [action.meta.seasonNum]: {
                  loaded: true,
                  failed: true,
                  fetching: false,
                },
              },
            },
          },
        },
      };
    default:
      return state;
  }
};
