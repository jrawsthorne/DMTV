import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Icon, Spin, Row, Col } from 'antd';
import { fetchPosts, fetchMedia } from '../actions/postActions';

import Post from '../components/Post/Post';


const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class PostsContainer extends React.Component {
  static propTypes = {
    fetchPosts: PropTypes.func.isRequired,
    fetchMedia: PropTypes.func.isRequired,
    posts: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    postsLoading: PropTypes.bool.isRequired,
    mediaLoading: PropTypes.bool.isRequired,
    mediaError: PropTypes.shape().isRequired,
    postsError: PropTypes.shape().isRequired,
    media: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  };
  componentDidMount() {
    if (this.props.posts.length === 0) {
      this.props.fetchPosts();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.posts !== this.props.posts) {
      this.props.fetchMedia(nextProps.posts);
    }
  }
  render() {
    const {
      postsLoading, mediaLoading, mediaError, postsError, posts, media,
    } = this.props;
    return (
      <div>
        <h1>Posts {(postsLoading || mediaLoading) && <Spin indicator={loadingIcon} />}</h1>
        <div className="posts">
          {!_.isEmpty(postsError.FETCH_POSTS_ERROR) && <p>{postsError.FETCH_POSTS_ERROR}</p>}
          {!_.isEmpty(mediaError.FETCH_MEDIA_ERROR) && <p>{mediaError.FETCH_MEDIA_ERROR}</p>}
          <Row gutter={20}>
            {_.isEmpty(postsError.FETCH_POSTS_ERROR)
            && _.isEmpty(mediaError.FETCH_MEDIA_ERROR)
            && !postsLoading
            && !mediaLoading
            &&
            posts.map(post =>
              (
                <Col key={post.id} span={3} >
                  <Post
                    post={post}
                    media={media.find(mediaItem => mediaItem.postId === post.id)}
                    key={post.id}
                  />
                </Col>))
            }
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.posts.items,
  postsLoading: state.posts.loading,
  mediaLoading: state.media.loading,
  mediaError: state.media.error,
  postsError: state.posts.error,
  media: state.media.items,
});

export default connect(mapStateToProps, { fetchPosts, fetchMedia })(PostsContainer);
