import { combineReducers } from 'redux';
import postReducer from './postReducer';
import movieReducer from './mediaReducer';

export default combineReducers({
  posts: postReducer,
  media: movieReducer,
});
