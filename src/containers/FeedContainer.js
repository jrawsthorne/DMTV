import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from '../vendor/InfiniteScroll';
import PostPreviewContainer from './PostPreviewContainer';
import PostPreviewLoading from '../components/post/PostPreviewLoading';

const FeedContainer = ({
  content, hasMore, loadMore, fetchingMore, fetching,
}) => (
  <InfiniteScroll
    loadMore={loadMore}
    hasMore={hasMore}
    className="postsLayout"
    loadingMore={fetchingMore || fetching}
    threshold={1500}
    loader={<div className="postsLayout__post" key="loader"><PostPreviewLoading /></div>}
  >
    {content.map(id => <PostPreviewContainer key={id} postId={id} />)}
  </InfiniteScroll>

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
