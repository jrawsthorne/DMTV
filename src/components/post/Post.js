import React from 'react';
import PropTypes from 'prop-types';

import Body from '../../helpers/bodyHelpers';
import LikeButton from './Buttons/LikeButton';
import Upvotes from './Counts/Upvotes';
import CommentButton from './Buttons/CommentButton';
import CommentCount from './Counts/CommentCount';
import Comments from '../../containers/CommentsContainer';


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
    <div className="Comments" style={{ marginTop: 25 }}>
      <Comments
        root
        author={post.author}
        permlink={post.permlink}
        id={post.id}
        count={post.children}
      />
    </div>
  </React.Fragment>
);

Post.propTypes = {
  post: PropTypes.shape().isRequired,
};

export default Post;
