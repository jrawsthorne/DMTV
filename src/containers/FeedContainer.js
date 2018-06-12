import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from '../vendor/InfiniteScroll';
import Loading from '../components/misc/Loading';
import PostPreviewContainer from './PostPreviewContainer';

const FeedContainer = ({
  content, hasMore, loadMore, fetchingMore,
}) => (
  <InfiniteScroll
    loadMore={loadMore}
    hasMore={hasMore}
    className="postsLayout"
    loadingMore={fetchingMore}
    threshold={1500}
    loader={<Loading />}
  >
    {content.map(id => <PostPreviewContainer key={id} postId={id} />)}
  </InfiniteScroll>

);

FeedContainer.propTypes = {
  content: PropTypes.arrayOf(PropTypes.string),
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  fetchingMore: PropTypes.bool,
};

FeedContainer.defaultProps = {
  content: [],
  hasMore: false,
  loadMore: () => {},
  fetchingMore: false,
};

export default FeedContainer;
