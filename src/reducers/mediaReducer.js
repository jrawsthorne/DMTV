import { FETCH_MEDIA_END, FETCH_MEDIA_START, FETCH_MEDIA_ERROR, FETCH_MEDIA_ITEM, FETCH_MEDIA_ITEM_ERROR, FETCH_MEDIA_ITEM_START } from '../actions/types';

const initialState = {
  items: [],
  loading: false,
  error: {},
  itemLoading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_MEDIA_START:
      return {
        ...state,
        loading: true,
      };
    case FETCH_MEDIA_END:
      return {
        ...state,
        loading: false,
        error: {},
      };
    case FETCH_MEDIA_ERROR:
      return {
        ...state,
        loading: false,
        error: { ...state.error, FETCH_MEDIA_ERROR: action.payload.message },
      };
    case FETCH_MEDIA_ITEM_START:
      return {
        ...state,
        itemLoading: true,
      };
    case FETCH_MEDIA_ITEM:
      return {
        ...state,
        itemLoading: false,
        items: [...state.items, action.payload],
        error: {},
      };
    case FETCH_MEDIA_ITEM_ERROR:
      return {
        ...state,
        itemLoading: false,
        error: { ...state.error, FETCH_MEDIA_ITEM_ERROR: action.payload.message },
      };
    default:
      return state;
  }
}
