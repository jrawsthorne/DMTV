import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import movieReducer from './mediaReducer';
import searchReducer from './searchReducer';
import authReducer from './authReducer';
import postReducer from './postReducer';
import feedReducer from './feedReducer';
import userReducer from './userReducer';
import subscriptionsReducer from './subscriptionsReducer';
import ratingsReducer from './ratingsReducer';

export default combineReducers({
  media: movieReducer,
  router: routerReducer,
  search: searchReducer,
  auth: authReducer,
  posts: postReducer,
  feed: feedReducer,
  users: userReducer,
  subscriptions: subscriptionsReducer,
  ratings: ratingsReducer,
});
