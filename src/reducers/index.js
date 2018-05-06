import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import movieReducer from './mediaReducer';
import searchReducer from './searchReducer';
import authReducer from './authReducer';
import postReducer from './postReducer';
import { responsiveReducer } from '../vendor/responsive';

export default combineReducers({
  media: movieReducer,
  router: routerReducer,
  search: searchReducer,
  auth: authReducer,
  posts: postReducer,
  responsive: responsiveReducer,
});
