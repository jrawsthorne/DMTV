import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from '../vendor/InfiniteScroll';
import PostPreviewLoading from '../components/post/PostPreviewLoading';
import MediaPagePostPreviewContainer from './MediaPagePostPreviewContainer';
import { PostsLayout } from './FeedContainer';

const MediaPageFeedContainer = ({
  content, fetchingMore, hasMore, loadMore, fetching,
}) => (
  <PostsLayout
    loadMore={loadMore}
    hasMore={hasMore}
    className="postsLayout"
    loadingMore={fetchingMore || fetching}
    threshold={1500}
    loader={<div className="postsLayout__post" key="loader"><PostPreviewLoading /></div>}
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
