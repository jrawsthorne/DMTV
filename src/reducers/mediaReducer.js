import { FETCH_MEDIA, FETCH_MEDIA_ERROR } from '../actions/types';

const initialState = {
  items: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_MEDIA:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case FETCH_MEDIA_ERROR:
      return {
        ...state,
        loading: false,
        error: { ...state.error, FETCH_MEDIA_ERROR: action.payload.message },
        items: [],
      };
    default:
      return state;
  }
}
