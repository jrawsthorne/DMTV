import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
// import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import theMovieDBAPI from './apis/theMovieDBAPI';
import steemAPI from './apis/steemAPI';
// import history from './history';


import rootReducer from './reducers';

const initialState = {};

const middleware = [
  thunk.withExtraArgument({
    theMovieDBAPI,
    steemAPI,
  }),
];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)),
);

export default store;
