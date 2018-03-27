import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const App = ({ history, children }) => (
  <div>
    <header>
        Links:
      {' '}
      <Link to="/">Home</Link>
      {' '}
      <Link to="/foo">Foo</Link>
      {' '}
      <Link to="/bar">Bar</Link>
    </header>
    <div>
      <button onClick={() => history.push('/foo')}>Go to /foo</button>
    </div>
    <div style={{ marginTop: '1.5em' }}>{children}</div>
  </div>
);

App.propTypes = {
  children: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

export default App;
