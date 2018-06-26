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

import FeedContainer from './MediaPageFeedContainer';

class PostsContainer extends React.Component {
  static propTypes = {
    fetchPosts: PropTypes.func.isRequired,
    fetchMorePosts: PropTypes.func.isRequired,
    match: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
  };
  componentDidMount() {
    /* fetch posts based on search criteria */
    const {
      fetchPosts,
      feed,
      match: {
        params: {
          mediaType,
          id: tmdbid,
          seasonNum,
          episodeNum,
        },
      },
    } = this.props;
    const category = {
      type: mediaType, tmdbid, seasonNum, episodeNum,
    };
    const content = getFeedFromState('created', category, feed);
    if (_.isEmpty(content)) {
      fetchPosts({ sortBy: 'created', category });
    }
  }
  componentDidUpdate(prevProps) {
    const {
      fetchPosts,
      feed,
      match: {
        url: currentUrl,
        params: {
          mediaType,
          id: tmdbid,
          seasonNum,
          episodeNum,
        },
      },
    } = this.props;
    const { match: { url: prevUrl } } = prevProps;
    const category = {
      type: mediaType, tmdbid, seasonNum, episodeNum,
    };
    const { fetching, loaded } = getFeedStatusFromState('created', category, feed);
    const content = getFeedFromState('created', category, feed);
    if (prevUrl !== currentUrl && ((!loaded && !fetching) || _.isEmpty(content))) {
      /* fetch posts based on search criteria */
      fetchPosts({ category });
    }
  }
  render() {
    const {
      fetchMorePosts,
      match: {
        params: {
          mediaType,
          id: tmdbid,
          seasonNum,
          episodeNum,
        },
      },
      feed,
    } = this.props;
    const category = {
      type: mediaType, tmdbid, seasonNum, episodeNum,
    };
    const content = getFeedFromState('created', category, feed);
    const loadMore = () => fetchMorePosts({ category });
    const {
      fetching, loaded, hasMore, failed, fetchingMore,
    } = getFeedStatusFromState('created', category, feed);
    if (failed) return <div><p>Sory, there was an error fetching posts</p></div>;
    if (loaded && _.isEmpty(content)) return <div><p>Sorry, no posts found</p></div>;
    return (
      <div className="posts">
        <div className="postsContainer">
          <FeedContainer
            content={content}
            fetchingMore={fetchingMore}
            hasMore={hasMore && !fetchingMore}
            loadMore={loadMore}
            fetching={fetching}
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
