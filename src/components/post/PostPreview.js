import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import BodyShort from './BodyShort';

/* styled components */

export const StyledPostPreview = styled.div`
  width: 100%;
  padding: 10px;
  @media (min-width: 768px) {
    width: 50%;
  }
`;

export const Backdrop = styled.div`
  background-color: #444;
  background-image: ${props => props.path && `url(https://image.tmdb.org/t/p/w780${props.path})`};
  height: 200px;
  background-size: cover;
`;

export const Body = styled.div`
  background: #fff;
  padding: 20px;
  margin-top: -25px;
  width: 95%;
  float: right;
`;

export const MediaTitle = styled.h2`
  margin-bottom: 0;
`;

export const CreatedIcon = styled(Icon)`
  font-size: 12px;
  margin-right: 5px;
`;

export const PostDetails = styled.p`
  margin-bottom: '1em';
  display: 'inline';
`;

/* end styled components */

const PostPreview = ({
  url,
  backdropPath,
  overview,
  title,
  mediaTitle,
  mediaUrl,
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
        <Backdrop path={backdropPath} />
      </Link>
      <Body>
        <MediaTitle>
          <Link to={mediaUrl}>{mediaTitle}</Link>
        </MediaTitle>
        <PostDetails>
          <CreatedIcon type="clock-circle-o" /> {created} - <Link to={`/@${post.author}`}>{post.author}</Link>
        </PostDetails>
        <h3><Link to={url}>{title}</Link></h3>
        <BodyShort body={overview} /> <Link to={url}>Read more</Link>
      </Body>
    </StyledPostPreview>
  );
};

PostPreview.propTypes = {
  overview: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  backdropPath: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  mediaTitle: PropTypes.string.isRequired,
  mediaUrl: PropTypes.string.isRequired,
  post: PropTypes.shape().isRequired,
};

export default PostPreview;
