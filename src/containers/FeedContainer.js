import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import InfiniteScroll from '../vendor/InfiniteScroll';
import Loading from '../components/misc/Loading';
import PostPreviewContainer from './PostPreviewContainer';

export const PostsLayout = styled(InfiniteScroll)`
  display: flex;
  flex-wrap: wrap;
`;

const FeedContainer = ({
  content, hasMore, loadMore, fetchingMore,
}) => (
  <PostsLayout
    loadMore={loadMore}
    hasMore={hasMore}
    loadingMore={fetchingMore}
    threshold={1500}
    loader={<Loading key="loader" />}
  >
    {content.map(id => <PostPreviewContainer key={id} postId={id} />)}
  </PostsLayout>
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
