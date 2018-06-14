import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../components/misc/Loading';
import MediaPagePostPreviewContainer from './MediaPagePostPreviewContainer';
import { PostsLayout } from './FeedContainer';

const MediaPageFeedContainer = ({
  content, fetchingMore, hasMore, loadMore,
}) => (
  <PostsLayout
    loadMore={loadMore}
    hasMore={hasMore}
    loadingMore={fetchingMore}
    threshold={1500}
    loader={<Loading />}
  >
    {content.map(id => <MediaPagePostPreviewContainer key={id} postId={id} />)}
  </PostsLayout>

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
