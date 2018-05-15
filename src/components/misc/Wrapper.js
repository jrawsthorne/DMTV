import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import steemConnectAPI from '../../apis/steemConnectAPI';
import * as actions from '../../actions/authActions';
import Topnav from '../navigation/Topnav';

class Wrapper extends React.Component {
  componentDidMount() {
    if (steemConnectAPI.options.accessToken && !this.props.isAuthenticated) {
      this.props.login();
    } else {
      this.props.logout();
    }
  }

  render() {
    const { username, history, route: { routes } } = this.props;

    return (
      <Layout>
        <Topnav username={username} history={history} />
        <Layout.Content>
          {renderRoutes(routes)}
        </Layout.Content>
      </Layout>);
  }
}

Wrapper.propTypes = {
  route: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  login: PropTypes.func,
  logout: PropTypes.func,
  username: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
};

Wrapper.defaultProps = {
  username: '',
  login: () => {},
  logout: () => {},
};

const mapStateToProps = state => ({
  username: state.auth.user.name,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login: actions.login, logout: actions.logout })(Wrapper);
