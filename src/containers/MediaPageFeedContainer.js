import React from 'react';
import PropTypes from 'prop-types';
import { PostPreviewLoading } from '../components/post/CardLoading';
import MediaPagePostPreviewContainer from './MediaPagePostPreviewContainer';
import { PostsLayout } from '../components/post/Posts';

const MediaPageFeedContainer = ({
  content, fetchingMore, hasMore, loadMore, fetching,
}) => (
  <PostsLayout
    loadMore={loadMore}
    hasMore={hasMore}
    loadingMore={fetchingMore || fetching}
    threshold={1500}
    loader={<PostPreviewLoading key="loader" />}
  >
    {content.map(id => <MediaPagePostPreviewContainer key={id} postId={id} />)}
  </PostsLayout>
);

MediaPageFeedContainer.propTypes = {
  content: PropTypes.arrayOf(PropTypes.string),
  fetchingMore: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  fetching: PropTypes.bool,
};

MediaPageFeedContainer.defaultProps = {
  content: [],
  fetchingMore: false,
  hasMore: false,
  loadMore: () => {},
  fetching: false,
};

export default MediaPageFeedContainer;
