import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { fetchPost } from '../../actions/postActions';

import Loading from '../misc/Loading';

import MediaContainer from '../media/MediaContainer';
import Post from '../post/Post';

class PostPage extends React.Component {
    static propTypes = {
      fetchPost: PropTypes.func.isRequired,
      post: PropTypes.shape(),
      loaded: PropTypes.bool,
      fetching: PropTypes.bool,
      failed: PropTypes.bool,
      match: PropTypes.shape().isRequired,
      location: PropTypes.shape().isRequired,
    };
    componentDidMount() {
      window.scrollTo(0, 0);
      if (!this.props.post) {
        this.props.fetchPost(
          this.props.match.params.author,
          this.props.match.params.permlink,
        );
      }
    }

    componentWillReceiveProps(nextProps) {
      if (!this.props.post && (this.props.location !== nextProps.location)) {
        this.props.fetchPost(
          this.props.match.params.author,
          this.props.match.params.permlink,
        );
      }
    }
    render() {
      const {
        loaded, failed, fetching, post,
      } = this.props;
      if (failed) return <Layout className="main-content"><p>Sorry, there was an error fetching the post</p></Layout>;
      if (fetching || !loaded) return <Loading />;
      return (
        <Layout>
          <MediaContainer noLoading mediaType={post.mediaType} tmdbid={`${post.tmdbid}`} seasonNum={_.get(post, 'seasonNum') && post.seasonNum.toString()} episodeNum={_.get(post, 'episodeNum') && post.episodeNum.toString()} />
          <Layout className="main-content">
            <Post body={post.body} title={post.title} />
          </Layout>
        </Layout>
      );
    }
}

PostPage.defaultProps = {
  post: undefined,
  fetching: false,
  failed: false,
  loaded: false,
};

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { author, permlink } } } = ownProps;
  return {
    post: _.get(state.posts.items, `@${author}/${permlink}`),
    fetching: _.get(state.posts.itemStates, `@${author}/${permlink}.fetching`),
    failed: _.get(state.posts.itemStates, `@${author}/${permlink}.failed`),
    loaded: _.get(state.posts.itemStates, `@${author}/${permlink}.loaded`),
  };
};

export default connect(mapStateToProps, { fetchPost })(PostPage);
