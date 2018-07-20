import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { PostsContainer } from '../components/post/Posts';
import * as actions from '../actions/postActions';
import {
  getFeedFromState,
  getFeedStatusFromState,
} from '../helpers/stateHelpers';
import { getFeed } from '../reducers';

import FeedContainer from './FeedContainer';

class SubscriptionPostsContainer extends React.Component {
  static propTypes = {
    fetchSubscriptions: PropTypes.func.isRequired,
    fetchMoreSubscriptions: PropTypes.func.isRequired,
    match: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
  };
  componentDidMount() {
    /* fetch subscription posts */
    const { fetchSubscriptions, feed } = this.props;
    const content = getFeedFromState('created', 'subscriptions', feed);
    if (_.isEmpty(content)) {
      fetchSubscriptions({});
    }
  }
  componentDidUpdate(prevProps) {
    const { fetchSubscriptions, feed, match: { url: currentUrl } } = this.props;
    const { match: { url: prevUrl } } = prevProps;
    const { fetching, loaded } = getFeedStatusFromState('created', 'subscriptions', feed);
    const content = getFeedFromState('created', 'subscriptions', feed);
    if (prevUrl !== currentUrl && ((!loaded && !fetching) || _.isEmpty(content))) {
      /* fetch subscription posts */
      fetchSubscriptions({});
    }
  }
  render() {
    const { feed, fetchMoreSubscriptions } = this.props;
    const loadMore = () => fetchMoreSubscriptions({});
    const content = getFeedFromState('created', 'subscriptions', feed);
    const {
      fetching, loaded, hasMore, failed, fetchingMore,
    } = getFeedStatusFromState('created', 'subscriptions', feed);
    if (failed && _.isEmpty(content)) {
      return <div><p>Sory, there was an error fetching posts</p></div>;
    }
    if (_.isEmpty(content) && loaded) return <div><p>Sorry, no posts found</p></div>;
    return (
      <PostsContainer>
        <FeedContainer
          content={content}
          hasMore={hasMore && !fetchingMore}
          loadMore={loadMore}
          fetchingMore={fetchingMore}
          fetching={fetching}
        />
      </PostsContainer>
    );
  }
}

const mapStateToProps = state => ({
  feed: getFeed(state),
});

const mapDispatchToProps = ({
  fetchSubscriptions: actions.fetchSubscriptions,
  fetchMoreSubscriptions: actions.fetchMoreSubscriptions,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SubscriptionPostsContainer));
