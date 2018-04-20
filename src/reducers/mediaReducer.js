import _ from 'lodash';

const initialState = {
  items: {},
  itemStates: {},
  loaded: false,
  failed: false,
  fetching: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'FETCH_MOVIE_PENDING':
    case 'FETCH_SHOW_PENDING':
      return {
        ...state,
        itemStates: {
          ...state.itemStates,
          [action.meta.type]: {
            ..._.get(state, `itemStates[${action.meta.type}]`),
            [action.meta.id]: {
              loaded: false,
              failed: false,
              fetching: true,
            },
          },
        },
      };
    case 'FETCH_MOVIE_FULFILLED':
    case 'FETCH_SHOW_FULFILLED':
      return {
        ...state,
        items: {
          ...state.items,
          [action.meta.type]: {
            ..._.get(state, `items[${action.meta.type}]`),
            [action.meta.id]: action.payload,
          },
        },
        itemStates: {
          ...state.itemStates,
          [action.meta.type]: {
            ..._.get(state, `itemStates[${action.meta.type}]`),
            [action.meta.id]: {
              loaded: true,
              failed: false,
              fetching: false,
            },
          },
        },
      };
    case 'FETCH_MOVIE_REJECTED':
    case 'FETCH_SHOW_REJECTED':
      return {
        ...state,
        itemStates: {
          ...state.itemStates,
          [action.meta.type]: {
            ..._.get(state, `itemStates[${action.meta.type}]`),
            [action.meta.id]: {
              loaded: true,
              failed: true,
              fetching: false,
            },
          },
        },
      };
    case 'FETCH_SEASON_PENDING':
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
                  loaded: false,
                  failed: false,
                  fetching: true,
                },
              },
            },
          },
        },
      };
    case 'FETCH_SEASON_FULFILLED':
      return {
        ...state,
        items: {
          ...state.items,
          shows: {
            ..._.get(state, 'items.shows'),
            [action.meta.id]: {
              ..._.get(state, `items.shows[${action.meta.id}]`),
              seasons: {
                ..._.get(state, `items.shows[${action.meta.id}].seasons`),
                [action.meta.seasonNum]: {
                  ..._.get(state, `items.shows[${action.meta.id}].seasons[${action.meta.seasonNum}]`),
                  episodes: action.payload,
                },
              },
            },
          },
        },
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
                  failed: false,
                  fetching: false,
                },
              },
            },
          },
        },
      };
    case 'FETCH_SEASON_REJECTED':
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
    case 'FETCH_SHOW_AND_SEASON_REJECTED':
      return {
        ...state,
        itemStates: {
          ...state.itemStates,
          shows: {
            ..._.get(state, 'itemStates.shows'),
            [action.meta.id]: {
              ..._.get(state, `itemStates.shows[${action.meta.id}]`),
              loaded: true,
              failed: true,
              fetching: false,
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
    case 'FETCH_SHOW_AND_SEASON_FULFILLED':
      return {
        ...state,
        items: {
          ...state.items,
          shows: {
            ..._.get(state, 'items.shows'),
            [action.meta.id]: action.payload,
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
                },
              },
            },
          },
        },
      };
    default:
      return state;
  }
}

export const getMediaItemState = (state, mediaType, path) => _.get(state, `itemStates[${mediaType}s][${path}]`);
export const getMediaItem = (state, mediaType, path) => _.get(state, `items[${mediaType}s][${path}]`);
