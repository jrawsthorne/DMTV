import React from 'react';
import PropTypes from 'prop-types';

import Body from '../../helpers/bodyHelpers';
import LikeButton from './LikeButton';
import Upvotes from './Upvotes';


const Post = ({ post }) => (
  <React.Fragment>
    <h1>{post.title}</h1>
    <Body body={post.body} returnType="Object" />
    <span style={{ marginTop: 20 }}>
      <LikeButton post={post} />
      <Upvotes votes={post.active_votes} />
    </span>
  </React.Fragment>
);

Post.propTypes = {
  post: PropTypes.shape().isRequired,
};

export default Post;
