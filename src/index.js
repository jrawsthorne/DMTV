import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import createHistory from 'history/createBrowserHistory';
import thunk from 'redux-thunk';
import Cookie from 'js-cookie';
import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router';
import promiseMiddleware from 'redux-promise-middleware';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import { mountResponsive } from './vendor/responsive';
import errorMiddleware from './errorMiddleware';
import theMovieDBAPI from './apis/theMovieDBAPI';
import steemConnectAPI from './apis/steemConnectAPI';
import steemAPI from './apis/steemAPI';
import rootReducer from './reducers';
import './styles/base.less';
import registerServiceWorker from './registerServiceWorker';

import routes from './routes';

/* if cookie on load set steemconnect token */
const accessToken = Cookie.get('access_token');
if (accessToken) {
  steemConnectAPI.setAccessToken(accessToken);
}

const initialState = {};
const history = createHistory();
// create middleware (thunk, promise)
const middleware = [
  routerMiddleware(history),
  errorMiddleware,
  promiseMiddleware(),
  thunk.withExtraArgument({
    theMovieDBAPI,
    steemAPI,
    steemConnectAPI,
  }),
];

// create store
const store = createStore(
  connectRouter(history)(rootReducer),
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)),
);
mountResponsive(store);

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <ConnectedRouter history={history}>
        <Switch>{renderRoutes(routes)}</Switch>
      </ConnectedRouter>
    </ThemeProvider>
  </Provider>
  , document.getElementById('root'),
);

/* service worker to serve cached files */
registerServiceWorker();
