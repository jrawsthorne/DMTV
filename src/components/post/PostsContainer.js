import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import * as actions from '../../actions/postActions';

import Loading from '../misc/Loading';

import PostPreviewContainer from './PostPreviewContainer';

class PostsContainer extends React.Component {
  static propTypes = {
    fetchPosts: PropTypes.func.isRequired,
    posts: PropTypes.arrayOf(PropTypes.string).isRequired,
    loaded: PropTypes.bool.isRequired,
    fetching: PropTypes.bool.isRequired,
    failed: PropTypes.bool.isRequired,
    tmdbid: PropTypes.string,
    mediaType: PropTypes.string,
    type: PropTypes.string,
    postType: PropTypes.string,
    seasonNum: PropTypes.string,
    episodeNum: PropTypes.string,
    match: PropTypes.shape().isRequired,
    author: PropTypes.string,
    subscriptions: PropTypes.bool,
    hasMore: PropTypes.bool,
  };
  static defaultProps = {
    tmdbid: undefined,
    mediaType: undefined,
    type: undefined,
    postType: undefined,
    episodeNum: undefined,
    seasonNum: undefined,
    author: undefined,
    subscriptions: false,
    hasMore: false,
  }
  componentDidMount() {
    /* fetch posts based on search criteria */
    if (!this.props.fetching) {
      this.props.fetchPosts({
        postType: this.props.postType,
        mediaType: this.props.mediaType,
        type: this.props.type,
        tmdbid: this.props.tmdbid,
        seasonNum: this.props.seasonNum,
        episodeNum: this.props.episodeNum,
        author: this.props.author,
        subscriptions: this.props.subscriptions,
      });
    }
  }
  componentDidUpdate(prevProps) {
    const {
      postType,
      mediaType,
      type,
      tmdbid,
      seasonNum,
      episodeNum,
      author,
      subscriptions,
      fetchPosts,
      match: {
        url: currentUrl,
      },
      loaded,
      fetching,
    } = this.props;
    const { match: { url: prevUrl } } = prevProps;
    if (prevUrl !== currentUrl || (!loaded && !fetching)) {
      /* fetch posts based on search criteria */
      fetchPosts({
        postType,
        mediaType,
        type,
        tmdbid,
        seasonNum,
        episodeNum,
        author,
        subscriptions,
      });
    }
  }
  loadMore = () =>
    this.props.fetchPosts({
      postType: this.props.postType,
      mediaType: this.props.mediaType,
      type: this.props.type,
      tmdbid: this.props.tmdbid,
      seasonNum: this.props.seasonNum,
      episodeNum: this.props.episodeNum,
      author: this.props.author,
      subscriptions: this.props.subscriptions,
      lastPost: this.props.posts[this.props.posts.length - 1],
    });
  render() {
    const {
      loaded,
      failed,
      fetching,
      posts,
      hasMore,
    } = this.props;
    if (fetching || !loaded) return <Loading />;
    if (failed) return <div><p>Sory, there was an error fetching posts</p></div>;
    if (_.isEmpty(posts)) return <div><p>Sorry, no posts found</p></div>;
    return (
      <div className="posts">
        <div className="postsContainer">
          <InfiniteScroll
            loadMore={this.loadMore}
            hasMore={!fetching && loaded && hasMore}
            className="postsLayout"
            threshold={1500}
            loader={<Loading />}
          >
            {posts.map(postId => <PostPreviewContainer key={postId} postId={postId} />)}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  /* where to find posts feed */
  /* TODO: better way to do this */
  let key = ownProps.mediaType || ownProps.type || ownProps.author || (ownProps.subscriptions && 'subscriptionsFeed') || 'all';
  if (ownProps.tmdbid) key += ownProps.tmdbid;
  if (ownProps.seasonNum) key += ownProps.seasonNum;
  if (ownProps.episodeNum) key += ownProps.episodeNum;
  return {
    posts: _.get(state, `feed.created.${key}.list`, []),
    fetching: _.get(state, `feed.created.${key}.fetching`, false),
    loaded: _.get(state, `feed.created.${key}.loaded`, false),
    failed: _.get(state, `feed.created.${key}.failed`, false),
    hasMore: _.get(state, `feed.created.${key}.hasMore`, false),
  };
};

export default withRouter(connect(mapStateToProps, {
  fetchPosts: actions.fetchPosts,
})(PostsContainer));
