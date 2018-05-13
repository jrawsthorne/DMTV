import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../actions/userActions';
import PostsContainer from '../post/PostsContainer';
import ProfileHeader from '../profile/ProfileHeader';

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
    const jsonMetadata = JSON.parse(user.json_metadata);
    const { profile } = jsonMetadata;
    const {
      name, cover_image: coverImage, about, website, location,
    } = profile;
    return (
      <React.Fragment>
        <ProfileHeader
          username={user.name}
          coverImage={coverImage}
          about={about}
          name={name}
          website={website}
          location={location}
        />
        <Layout className="main-content">
          <h2>Latest posts from {name || user.name}</h2>
          <PostsContainer author={user.name} />
        </Layout>
      </React.Fragment>
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
