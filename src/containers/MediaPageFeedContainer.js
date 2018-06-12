import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from '../vendor/InfiniteScroll';
import Loading from '../components/misc/Loading';
import MediaPagePostPreviewContainer from './MediaPagePostPreviewContainer';

const MediaPageFeedContainer = ({
  content, fetchingMore, hasMore, loadMore,
}) => (
  <InfiniteScroll
    loadMore={loadMore}
    hasMore={hasMore}
    className="postsLayout"
    loadingMore={fetchingMore}
    threshold={1500}
    loader={<Loading />}
  >
    {content.map(id => <MediaPagePostPreviewContainer key={id} postId={id} />)}
  </InfiniteScroll>

);

MediaPageFeedContainer.propTypes = {
  content: PropTypes.arrayOf(PropTypes.string),
  fetchingMore: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
};

MediaPageFeedContainer.defaultProps = {
  content: [],
  fetchingMore: false,
  hasMore: false,
  loadMore: () => {},
};

export default MediaPageFeedContainer;
