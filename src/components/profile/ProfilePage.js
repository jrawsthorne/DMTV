import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../../actions/userActions';
import { getUser, getUserState } from '../../reducers';
import PostsContainer from '../../containers/UserPostsContainer';
import ProfileHeader from './ProfileHeader';

import Loading from '../misc/Loading';

class ProfilePage extends React.Component {
  componentDidMount() {
    const { match: { params: { username } }, fetchAccount, user } = this.props;
    if (!user) {
      fetchAccount(username);
    }
  }
  componentDidUpdate(prevProps) {
    const {
      match: { url: currentURL, params: { username } }, user, fetchAccount, fetching, loaded,
    } = this.props;
    if ((!fetching && !loaded) || (!user && currentURL !== prevProps.match.url)) {
      fetchAccount(username);
    }
  }
  render() {
    const {
      user, loaded, fetching, failed,
    } = this.props;
    if (!loaded || fetching) return <Loading />;
    if (failed || !user) return <div className="main-content">Sorry, there was an error fetching that user</div>;
    /* get profile from user JSON metadata */
    const jsonMetadata = JSON.parse(user.json_metadata);
    const { profile } = jsonMetadata;
    return (
      <React.Fragment>
        <ProfileHeader
          username={user.name}
          coverImage={profile && profile.cover_image}
          about={profile && profile.about}
          name={profile && profile.name}
          website={profile && profile.website}
          location={profile && profile.location}
        />
        <Layout className="main-content">
          <h2>Latest posts from {(profile && profile.name) || user.name}</h2>
          {/* posts by that user */}
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
  user: getUser(state, ownProps.match.params.username),
  ...getUserState(state, ownProps.match.params.username),
});

export default connect(mapStateToProps, { fetchAccount: actions.fetchAccount })(ProfilePage);
