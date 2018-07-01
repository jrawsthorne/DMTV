import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions/userActions';
import { getUser, getUserState } from '../reducers';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileHeaderLoading from '../components/profile/ProfileHeaderLoading';

class ProfileHeaderContainer extends React.Component {
  componentDidMount() {
    const { username, fetchAccount, user } = this.props;
    if (!user) {
      fetchAccount(username);
    }
  }
  componentDidUpdate(prevProps) {
    const {
      match: { url: currentURL }, username, user, fetchAccount, fetching, loaded,
    } = this.props;
    if ((!fetching && !loaded) || (!user && currentURL !== prevProps.match.url)) {
      fetchAccount(username);
    }
  }
  render() {
    const {
      user, loaded, fetching, failed,
    } = this.props;
    if (!loaded || fetching) return <ProfileHeaderLoading />;
    if (failed || !user) return <div className="main-content">Sorry, there was an error fetching that user</div>;
    /* get profile from user JSON metadata */
    const jsonMetadata = JSON.parse(user.json_metadata);
    const { profile } = jsonMetadata;
    return (
      <ProfileHeader
        username={user.name}
        coverImage={profile && profile.cover_image}
        about={profile && profile.about}
        name={profile && profile.name}
        website={profile && profile.website}
        location={profile && profile.location}
      />
    );
  }
}

ProfileHeaderContainer.propTypes = {
  user: PropTypes.shape(),
  username: PropTypes.string.isRequired,
  fetchAccount: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  failed: PropTypes.bool.isRequired,
  match: PropTypes.shape().isRequired,
};

ProfileHeaderContainer.defaultProps = {
  user: null,
};

const mapStateToProps = (state, ownProps) => ({
  user: getUser(state, ownProps.username),
  ...getUserState(state, ownProps.username),
});

const mapDispatchToProps = {
  fetchAccount: actions.fetchAccount,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileHeaderContainer));
