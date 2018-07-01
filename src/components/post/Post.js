import React from 'react';
import PropTypes from 'prop-types';

import Body from '../../helpers/bodyHelpers';
import LikeButton from './Buttons/LikeButton';
import Upvotes from './Counts/Upvotes';
import CommentButton from './Buttons/CommentButton';
import CommentCount from './Counts/CommentCount';


const Post = ({ post }) => (
  <React.Fragment>
    <h1>{post.title}</h1>
    <Body body={post.body} returnType="Object" />
    <span style={{ marginTop: 20 }}>
      <LikeButton post={post} />
      <Upvotes votes={post.active_votes} />
      <CommentButton post={post} />
      <CommentCount count={post.children} />
    </span>
  </React.Fragment>
);

Post.propTypes = {
  post: PropTypes.shape().isRequired,
};

export default Post;
