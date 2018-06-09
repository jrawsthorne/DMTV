import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import Loading from '../components/misc/Loading';
import MediaPagePostPreviewContainer from './MediaPagePostPreviewContainer';

const MediaPageFeedContainer = ({
  content, fetching, hasMore, loadMore,
}) => (
  <InfiniteScroll
    loadMore={loadMore}
    hasMore={!fetching && hasMore}
    className="postsLayout"
    threshold={1500}
    loader={<Loading />}
  >
    {content.map(id => <MediaPagePostPreviewContainer key={id} postId={id} />)}
  </InfiniteScroll>

);

MediaPageFeedContainer.propTypes = {
  content: PropTypes.arrayOf(PropTypes.string),
  fetching: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
};

MediaPageFeedContainer.defaultProps = {
  content: [],
  fetching: false,
  hasMore: false,
  loadMore: () => {},
};

export default MediaPageFeedContainer;
