import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchPosts } from '../../actions/postActions';

import Loading from '../misc/Loading';

import Post from './PostPreview';

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
      isXSmall: PropTypes.bool,
      isSmall: PropTypes.bool,
      allPosts: PropTypes.shape().isRequired,
      author: PropTypes.string,
    };
    static defaultProps = {
      tmdbid: undefined,
      mediaType: undefined,
      type: undefined,
      postType: undefined,
      episodeNum: undefined,
      seasonNum: undefined,
      isXSmall: false,
      isSmall: false,
      author: undefined,
    }
    componentDidMount() {
      if (_.isEmpty(this.props.posts) && !this.props.fetching) {
        this.props.fetchPosts(this.props.allPosts, {
          postType: this.props.postType,
          mediaType: this.props.mediaType,
          type: this.props.type,
          tmdbid: this.props.tmdbid,
          seasonNum: this.props.seasonNum,
          episodeNum: this.props.episodeNum,
          author: this.props.author,
        });
      }
    }
    componentWillReceiveProps(nextProps) {
      if (_.isEmpty(nextProps.posts)) {
        if ((!nextProps.fetching && !nextProps.loaded)
      || (nextProps.match.url !== this.props.match.url)) {
          nextProps.fetchPosts(nextProps.allPosts, {
            postType: nextProps.postType,
            mediaType: nextProps.mediaType,
            type: nextProps.type,
            tmdbid: nextProps.tmdbid,
            seasonNum: nextProps.seasonNum,
            episodeNum: nextProps.episodeNum,
            author: this.props.author,
          });
        }
      }
    }
    render() {
      const {
        loaded,
        failed,
        fetching,
        posts,
        isXSmall,
        isSmall,
        allPosts,
      } = this.props;
      if (failed && _.isEmpty(posts)) {
        return <div><p>Sory, there was an error fetching posts</p></div>;
      }
      if (_.isEmpty(posts) && !fetching && loaded) {
        return <div><p>Sorry, no posts found</p></div>;
      }
      return (
        <div className="posts">
          <div className="posterContainer">
            <div className="posterLayout">
              {posts.map((postId) => {
                const post = allPosts[postId];
                let title = post.mediaTitle;
                if (post.seasonNum) {
                  title += ` S${post.seasonNum}`;
                  if (post.episodeNum) {
                    title += ` E${post.episodeNum}`;
                  }
                }
                let poster = post.posterPath || '';
                if (isXSmall && !isSmall) {
                  // make image for no backdrop path
                  poster = post.episodePath || post.backdropPath || '';
                }
              return (
                <div key={post.id} className="posterLayout__poster">
                  <Post
                    overview={post.body}
                    id={post.id}
                    title={post.title}
                    permlink={post.permlink}
                    posterPath={poster}
                    mediaTitle={title}
                    author={post.author}
                    url={`/${post.url}`}
                  />
                </div>
              );
})}
            </div>
          </div>
          {fetching && <Loading />}
        </div>
      );
    }
}

const mapStateToProps = (state, ownProps) => {
  let key = ownProps.mediaType || ownProps.type || ownProps.author || 'all';
  if (ownProps.tmdbid) key += ownProps.tmdbid;
  if (ownProps.seasonNum) key += ownProps.seasonNum;
  if (ownProps.episodeNum) key += ownProps.episodeNum;
  return {
    posts: _.get(state, `feed.created.${key}.list`, []),
    allPosts: _.get(state, 'posts.items', {}),
    fetching: _.get(state, `feed.created.${key}.fetching`, false),
    loaded: _.get(state, `feed.created.${key}.loaded`, false),
    failed: _.get(state, `feed.created.${key}.failed`, false),
    isXSmall: state.responsive.isXSmall,
    isSmall: state.responsive.isSmall,
  };
};

export default withRouter(connect(mapStateToProps, { fetchPosts })(PostsContainer));
