import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import movieReducer, * as fromMedia from './mediaReducer';
import searchReducer from './searchReducer';

export default combineReducers({
  media: movieReducer,
  router: routerReducer,
  search: searchReducer,
});

export const getMediaItem = (state, mediaType, path) =>
  fromMedia.getMediaItem(state.media, mediaType, path);

export const getMediaItemState = (state, mediaType, path) =>
  fromMedia.getMediaItemState(state.media, mediaType, path);
