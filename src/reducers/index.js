import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import postReducer from './postReducer';
import movieReducer from './mediaReducer';

export default combineReducers({
  posts: postReducer,
  media: movieReducer,
  router: routerReducer,
});
