import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import Loading from '../components/misc/Loading';
import PostPreviewContainer from './PostPreviewContainer';

const FeedContainer = ({
  content, fetching, hasMore, loadMore,
}) => (
  <InfiniteScroll
    loadMore={loadMore}
    hasMore={!fetching && hasMore}
    className="postsLayout"
    threshold={1500}
    loader={<Loading />}
  >
    {content.map(id => <PostPreviewContainer key={id} postId={id} />)}
  </InfiniteScroll>

);

FeedContainer.propTypes = {
  content: PropTypes.arrayOf(PropTypes.string),
  fetching: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
};

FeedContainer.defaultProps = {
  content: [],
  fetching: false,
  hasMore: false,
  loadMore: () => {},
};

export default FeedContainer;
