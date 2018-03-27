import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import createHistory from 'history/createBrowserHistory';
import thunk from 'redux-thunk';
import { ConnectedRouter } from 'react-router-redux';
import theMovieDBAPI from './apis/theMovieDBAPI';
import steemAPI from './apis/steemAPI';
import rootReducer from './reducers';
import './styles/base.less';

import routes from './common/routes';

const initialState = {};
const history = createHistory();
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

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>{renderRoutes(routes)}</Switch>
    </ConnectedRouter>
  </Provider>
  , document.getElementById('root'),
);
