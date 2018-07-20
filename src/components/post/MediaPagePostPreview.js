import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import BodyShort from './BodyShort';
import { Backdrop, StyledPostPreview, Body, MediaTitle, PostDetails, CreatedIcon } from './PostPreview';
import LikeButton from './Buttons/LikeButton';
import Upvotes from './Counts/Upvotes';
import CommentButton from './Buttons/CommentButton';
import CommentCount from './Counts/CommentCount';

import './PostPreview.less';

const PostPreview = ({
  url,
  backdropPath,
  overview,
  title,
  post,
}) => {
  const options = {
    year: 'numeric', month: 'long', day: 'numeric',
  };
  /* human readable date */
  let created = new Date(post.created);
  created = created.toLocaleDateString('en-GB', options);
  return (
    <StyledPostPreview>
      <Link to={url}>
        {/* coloured background if doesn't exist */}
        <Backdrop path={backdropPath} />
      </Link>
      <Body>
        <MediaTitle>
          <Link to={url}>{title}</Link>
        </MediaTitle>
        <PostDetails>
          <CreatedIcon type="clock-circle-o" /> {created} - <Link to={`/@${post.author}`}>{post.author}</Link>
        </PostDetails>
        <BodyShort body={overview} /> <Link to={url}>Read more</Link>
        <span style={{ marginTop: 10, display: 'block' }}>
          <LikeButton post={post} />
          <Upvotes votes={post.active_votes} />
          <CommentButton post={post} />
          <CommentCount count={post.children} />
        </span>
      </Body>
    </StyledPostPreview>
  );
};

PostPreview.propTypes = {
  overview: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  backdropPath: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  post: PropTypes.shape().isRequired,
};

export default PostPreview;
