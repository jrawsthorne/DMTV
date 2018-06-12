import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions/postActions';
import {
  getFeedFromState,
  getFeedStatusFromState,
} from '../helpers/stateHelpers';
import { getFeed } from '../reducers';

import Loading from '../components/misc/Loading';

import FeedContainer from './FeedContainer';

class PostsContainer extends React.Component {
  static propTypes = {
    fetchPosts: PropTypes.func.isRequired,
    fetchMorePosts: PropTypes.func.isRequired,
    match: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
  };
  componentDidMount() {
    /* fetch posts based on search criteria */
    const { fetchPosts, feed, match: { params: { sortBy: sort, category } } } = this.props;
    const sortBy = sort || 'trending';
    const content = getFeedFromState(sortBy, category, feed);
    if (_.isEmpty(content)) {
      fetchPosts({
        sortBy, category,
      });
    }
  }
  componentDidUpdate(prevProps) {
    const {
      fetchPosts,
      feed,
      match: {
        url: currentUrl,
        params: {
          sortBy: sort,
          category,
        },
      },
    } = this.props;
    const { match: { url: prevUrl } } = prevProps;
    const sortBy = sort || 'trending';
    const { fetching, loaded } = getFeedStatusFromState(sortBy, category, feed);
    const content = getFeedFromState(sortBy, category, feed);
    if (prevUrl !== currentUrl && ((!loaded && !fetching) || _.isEmpty(content))) {
      /* fetch posts based on search criteria */
      fetchPosts({
        sortBy,
        category,
      });
    }
  }
  render() {
    const {
      fetchMorePosts,
      match: { params: { sortBy: sort, category } },
      feed,
    } = this.props;
    const sortBy = sort || 'trending';
    const content = getFeedFromState(sortBy, category, feed);
    const loadMore = () => fetchMorePosts({ category, sortBy });
    const {
      fetching, loaded, hasMore, failed, fetchingMore,
    } = getFeedStatusFromState(sortBy, category, feed);
    if (fetching || !loaded) return <Loading />;
    if (failed) return <div><p>Sory, there was an error fetching posts</p></div>;
    if (_.isEmpty(content)) return <div><p>Sorry, no posts found</p></div>;
    return (
      <div className="posts">
        <div className="postsContainer">
          <FeedContainer
            content={content}
            hasMore={hasMore && !fetchingMore}
            loadMore={loadMore}
            fetchingMore={fetchingMore}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  feed: getFeed(state),
});

const mapDispatchToProps = ({
  fetchPosts: actions.fetchPosts,
  fetchMorePosts: actions.fetchMorePosts,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostsContainer));
