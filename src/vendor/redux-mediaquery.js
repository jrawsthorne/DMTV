// Forked from https://github.com/Yaska/redux-mediaquery
// MIT licensed
import debounce from 'lodash/debounce';
import each from 'lodash/each';
import matchMedia from 'matchmedia';

export const MEDIA_MOUNTED = 'rdx-mqt/MEDIA_MOUNTED';
export const MEDIA_CHANGED = 'rdx-mqt/MEDIA_CHANGED';

// Reducer
export function reducer(state = {}, action) {
  switch (action.type) {
    case MEDIA_CHANGED:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}

// Actions
export function mediaChanged(data) {
  return {
    type: MEDIA_CHANGED,
    payload: data,
  };
}

const makeOnResize = dispatch =>
  debounce(() => {
    const data = {};
    dispatch(mediaChanged(data));
  }, 500);

function trackMediaQuery(label, query, dispatch, initData) {
  const mq = matchMedia(query);

  const listener = () =>
    dispatch(mediaChanged({
      [label]: mq.matches,
    }));

  mq.addListener(listener);

  initData[label] = mq.matches;
}

export function mediaQueryTracker(queries) {
  return (dispatch) => {
    const initData = {};
    if (matchMedia) {
      each(queries, (query, label) => {
        trackMediaQuery(label, query, dispatch, initData);
      });
      dispatch(mediaChanged(initData));
    }
  };
}
