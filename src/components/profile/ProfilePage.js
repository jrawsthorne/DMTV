import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import PostsContainer from '../../containers/UserPostsContainer';
import ProfileHeaderContainer from '../../containers/ProfileHeaderContainer';
import ReloadFeedButton from '../misc/ReloadFeedButton';

const ProfilePage = ({ match: { params: { username } } }) => (
  <React.Fragment>
    <ProfileHeaderContainer username={username} />
    <Layout className="main-content">
      <h2>Latest posts from {username} <ReloadFeedButton sortBy="created" category={{ author: username }} /></h2>
      {/* posts by that user */}
      <PostsContainer author={username} />
    </Layout>
  </React.Fragment>
);

ProfilePage.propTypes = {
  match: PropTypes.shape().isRequired,
};

export default ProfilePage;
