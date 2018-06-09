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
    /* login if access token but not authenticated */
    if (steemConnectAPI.options.accessToken && !this.props.isAuthenticated) {
      this.props.login()
        .then(() => {
          /* fetching ratings and subscriptions after login */
          this.props.fetchUserRatings();
          this.props.fetchUserSubscriptions();
        });
    } else {
      this.props.loggedOut();
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
  login: PropTypes.func.isRequired,
  loggedOut: PropTypes.func.isRequired,
  username: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
  fetchUserRatings: PropTypes.func.isRequired,
  fetchUserSubscriptions: PropTypes.func.isRequired,
};

Wrapper.defaultProps = {
  username: '',
};

const mapStateToProps = state => ({
  username: state.auth.user.name,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = {
  login: actions.login,
  loggedOut: actions.loggedOut,
  fetchUserRatings: actions.fetchUserRatings,
  fetchUserSubscriptions: actions.fetchUserSubscriptions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);
