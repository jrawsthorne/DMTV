const initialState = {
  results: [],
  loaded: false,
  failed: false,
  fetching: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SEARCH_PENDING':
      return {
        ...state,
        loaded: false,
        failed: false,
        fetching: true,
      };
    case 'SEARCH_FULFILLED':
      return {
        ...state,
        results: action.payload,
        loaded: true,
        failed: false,
        fetching: false,
      };
    case 'SEARCH_REJECTED':
      return {
        ...state,
        loaded: true,
        failed: true,
        fetching: false,
      };
    default:
      return state;
  }
}
