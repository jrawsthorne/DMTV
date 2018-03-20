import React from 'react';
import { Provider } from 'react-redux';
import Sidenav from './components/Navigation/Sidenav';

import store from './store';
import './styles/base.less';

const App = () => (
  <Provider store={store}>
    <Sidenav />
  </Provider>
);

export default App;
