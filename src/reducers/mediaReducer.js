import _ from 'lodash';

const initialState = {
  items: {},
  itemStates: {},
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
    case 'FETCH_EPISODE_PENDING':
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
    case 'FETCH_EPISODE_FULFILLED':
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
                  episodes: _.mapValues(action.payload, () => ({
                    ...state,
                    loaded: true,
                    failed: false,
                    fetching: false,
                  })),
                },
              },
            },
          },
        },
      };
    case 'FETCH_SEASON_REJECTED':
    case 'FETCH_SEASON_AND_SHOW_REJECTED':
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
    case 'FETCH_SEASON_AND_SHOW_PENDING':
    case 'FETCH_EPISODE_AND_SHOW_PENDING':
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
    case 'FETCH_SEASON_AND_SHOW_FULFILLED':
    case 'FETCH_EPISODE_AND_SHOW_FULFILLED':
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
    case 'FETCH_EPISODE_AND_SHOW_REJECTED':
    case 'FETCH_EPISODE_REJECTED':
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
    default:
      return state;
  }
}
