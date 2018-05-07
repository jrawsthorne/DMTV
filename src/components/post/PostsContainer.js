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
      posts: PropTypes.shape().isRequired,
      loaded: PropTypes.bool.isRequired,
      fetching: PropTypes.bool.isRequired,
      failed: PropTypes.bool.isRequired,
      tmdbid: PropTypes.string,
      mediaType: PropTypes.string,
      postType: PropTypes.string,
      seasonNum: PropTypes.string,
      episodeNum: PropTypes.string,
      match: PropTypes.shape().isRequired,
      isXSmall: PropTypes.bool,
      isSmall: PropTypes.bool,
    };
    static defaultProps = {
      tmdbid: undefined,
      mediaType: undefined,
      postType: undefined,
      episodeNum: undefined,
      seasonNum: undefined,
      isXSmall: false,
      isSmall: false,
    }
    componentDidMount() {
      this.props.fetchPosts(this.props.posts, {
        postType: this.props.postType,
        mediaType: this.props.mediaType,
        tmdbid: this.props.tmdbid,
        seasonNum: this.props.seasonNum,
        episodeNum: this.props.episodeNum,
      });
    }
    componentWillReceiveProps(nextProps) {
      if ((!nextProps.fetching && !nextProps.loaded)
      || (nextProps.match.url !== this.props.match.url)) {
        this.props.fetchPosts(nextProps.posts, {
          posts: this.props.posts,
          postType: nextProps.postType,
          mediaType: nextProps.mediaType,
          tmdbid: nextProps.tmdbid,
          seasonNum: nextProps.seasonNum,
          episodeNum: nextProps.episodeNum,
        });
      }
    }
    filterPosts = (posts, mediaType, postType = 'all', tmdbid, seasonNum, episodeNum) => {
      if (mediaType && tmdbid && postType === 'all') {
        if (seasonNum) {
          if (episodeNum) {
            return _.filter(posts, post => (
              post.tmdbid === parseInt(tmdbid, 10) &&
              post.mediaType === mediaType &&
              post.seasonNum === parseInt(seasonNum, 10) &&
              post.episodeNum === parseInt(episodeNum, 10)
            ));
          }
          return _.filter(posts, post => (
            post.tmdbid === parseInt(tmdbid, 10) &&
              post.mediaType === mediaType &&
              post.seasonNum === parseInt(seasonNum, 10)
          ));
        }
        return _.filter(posts, post => (
          post.tmdbid === parseInt(tmdbid, 10) &&
            post.mediaType === mediaType
        ));
      } else if (mediaType && !tmdbid && postType === 'all') {
        return _.filter(posts, post => (
          post.mediaType === mediaType
        ));
      }
      return _.filter(posts);
    }

    render() {
      const {
        loaded,
        failed,
        fetching,
        posts,
        mediaType,
        tmdbid,
        postType,
        seasonNum,
        episodeNum,
        isXSmall,
        isSmall,
      } = this.props;
      const matchedPosts = this.filterPosts(
        posts,
        mediaType,
        postType,
        tmdbid,
        seasonNum,
        episodeNum,
      );
      if (failed && _.isEmpty(matchedPosts)) {
        return <div><p>Sory, there was an error fetching posts</p></div>;
      }
      if (_.isEmpty(matchedPosts) && !fetching && loaded) {
        return <div><p>Sorry, no posts found</p></div>;
      }
      return (
        <div className="posts">
          <div className="posterContainer">
            <div className="posterLayout">
              {matchedPosts.map((post) => {
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

const mapStateToProps = state => ({
  posts: state.posts.items,
  fetching: state.posts.fetching,
  loaded: state.posts.loaded,
  failed: state.posts.failed,
  isXSmall: state.responsive.isXSmall,
  isSmall: state.responsive.isSmall,
});

export default withRouter(connect(mapStateToProps, { fetchPosts })(PostsContainer));
