import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
// import { Layout } from 'antd';
// import createBrowserHistory from 'history/createBrowserHistory';
// import { history } from './history';
import store from './store';
import './styles/base.less';
import registerServiceWorker from './registerServiceWorker';

// import Topnav from './components/Navigation/Topnav';
// import MediaPage from './components/pages/MediaPage';
import HomePage from './components/pages/HomePage';
import Media from './components/Media/Media';

// const history = createBrowserHistory();

render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/:reviewType/:id" component={Media} />
      </Switch>
    </BrowserRouter>
  </Provider>
  , document.getElementById('root'),
);

registerServiceWorker();
