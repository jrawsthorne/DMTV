import { FETCH_POSTS, FETCH_POSTS_ERROR, REMOVE_POST } from '../actions/types';

const initialState = {
  items: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_POSTS:
      return {
        ...state,
        items: action.payload,
        loading: false,
      };
    case FETCH_POSTS_ERROR:
      return {
        ...state,
        loading: false,
        error: { ...state.error, FETCH_POSTS_ERROR: action.payload.message },
        items: [],
      };
    case REMOVE_POST:
      return {
        items: state.items.filter(e => e !== action.payload),
      };
    default:
      return state;
  }
}
