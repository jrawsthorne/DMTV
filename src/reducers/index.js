import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import movieReducer from './mediaReducer';
import searchReducer from './searchReducer';

export default combineReducers({
  media: movieReducer,
  router: routerReducer,
  search: searchReducer,
});
