import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../actions/userActions';

import Loading from '../misc/Loading';

class ProfilePage extends React.Component {
  componentDidMount() {
    const { match: { params: { username } }, fetchAccount, user } = this.props;
    if (!user) {
      fetchAccount(username);
    }
  }
  componentWillReceiveProps(nextProps) {
    const {
      match: { url: currentURL, params: { username } }, user, fetchAccount, fetching, loaded,
    } = nextProps;
    if ((!fetching && !loaded) || (!user && currentURL !== this.props.match.url)) {
      fetchAccount(username);
    }
  }
  render() {
    const {
      user, loaded, fetching, failed,
    } = this.props;
    if (!loaded || fetching) return <Loading />;
    if (failed || !user) return <div className="main-content">Sorry, there was an error fetching that user</div>;
    return (
      <Layout className="main-content">
        {user.name}
      </Layout>
    );
  }
}

ProfilePage.defaultProps = {
  user: undefined,
};

ProfilePage.propTypes = {
  user: PropTypes.shape(),
  match: PropTypes.shape().isRequired,
  fetchAccount: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  failed: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  user: _.get(state, `users.users[${ownProps.match.params.username}]`),
  fetching: _.get(state, `users.users[${ownProps.match.params.username}].fetching`, false),
  loaded: _.get(state, `users.users[${ownProps.match.params.username}].loaded`, false),
  failed: _.get(state, `users.users[${ownProps.match.params.username}].failed`, false),
});

export default connect(mapStateToProps, { fetchAccount: actions.fetchAccount })(ProfilePage);
