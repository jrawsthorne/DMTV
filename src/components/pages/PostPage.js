import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Layout } from 'antd';
import classNames from 'classnames';

import Loading from '../misc/Loading';
import './PostPage.less';

import MediaContainer from '../media/MediaContainer';
import PostContainer from '../post/PostContainer';

class PostPage extends React.Component {
    static propTypes = {
      match: PropTypes.shape().isRequired,
    };

    state = {
      post: {},
      postStatus: { failed: false, fetching: false, loaded: false },
      mediaStatus: { failed: false, fetching: false, loaded: false },
    }

    componentDidMount() {
      window.scrollTo(0, 0);
    }

    onPostLoad = (post, postStatus) => {
      this.setState({
        post,
        postStatus,
      });
    }

    onMediaLoad = mediaStatus =>
      this.setState({
        mediaStatus,
      })
    render() {
      const {
        match: { params: { author, permlink } },
      } = this.props;
      const { post, mediaStatus, postStatus } = this.state;
      return (
        <Layout>
          {(postStatus.fetching
              || !postStatus.loaded
              || (!postStatus.failed && !mediaStatus.loaded)
              || (!postStatus.failed && mediaStatus.fetching)) && <Loading />}
          {postStatus.loaded && !postStatus.failed &&
            <MediaContainer
              noLoading
              onLoad={this.onMediaLoad}
              mediaType={post.mediaType}
              tmdbid={`${post.tmdbid}`}
              seasonNum={_.get(post, 'seasonNum') && post.seasonNum.toString()}
              episodeNum={_.get(post, 'episodeNum') && post.episodeNum.toString()}
            />}
          <Layout className={classNames('main-content', 'PostPage__post', { showPost: mediaStatus.loaded || postStatus.failed })}>
            <PostContainer
              noLoading
              onLoad={this.onPostLoad}
              author={author}
              permlink={permlink}
            />
          </Layout>
        </Layout>
      );
    }
}

export default PostPage;
