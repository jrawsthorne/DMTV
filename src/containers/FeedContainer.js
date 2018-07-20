import React from 'react';
import PropTypes from 'prop-types';
import PostPreviewContainer from './PostPreviewContainer';
import { PostPreviewLoading } from '../components/post/CardLoading';
import { PostsLayout } from '../components/post/Posts';

const FeedContainer = ({
  content, hasMore, loadMore, fetchingMore, fetching,
}) => (
  <PostsLayout
    loadMore={loadMore}
    hasMore={hasMore}
    loadingMore={fetchingMore || fetching}
    threshold={1500}
    loader={<PostPreviewLoading key="loader" />}
  >
    {content.map(id => <PostPreviewContainer key={id} postId={id} />)}
  </PostsLayout>
);

FeedContainer.propTypes = {
  content: PropTypes.arrayOf(PropTypes.string),
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  fetchingMore: PropTypes.bool,
  fetching: PropTypes.bool,
};

FeedContainer.defaultProps = {
  content: [],
  hasMore: false,
  loadMore: () => {},
  fetchingMore: false,
  fetching: false,
};

export default FeedContainer;
