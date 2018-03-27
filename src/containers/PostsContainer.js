import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Icon, Spin, Row, Col } from 'antd';
import { fetchPosts } from '../actions/postActions';
import { getTmdbIdFromPost, getReviewTypeFromPost } from '../helpers/apiHelpers';

import Post from '../components/Post/Post';


const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class PostsContainer extends React.Component {
  static propTypes = {
    fetchPosts: PropTypes.func.isRequired,
    posts: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    postsLoading: PropTypes.bool.isRequired,
    mediaLoading: PropTypes.bool.isRequired,
    mediaError: PropTypes.shape().isRequired,
    postsError: PropTypes.shape().isRequired,
    media: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    category: PropTypes.string.isRequired,
  };
  componentDidMount() {
    if (this.props.posts.length === 0) {
      this.props.fetchPosts({ category: this.props.category, sortBy: 'created' });
    }
  }
  render() {
    const {
      postsLoading, mediaLoading, mediaError, postsError, posts, media,
    } = this.props;
    return (
      <div>
        <h1>New Movie Reviews {(postsLoading || mediaLoading)
            && <Spin indicator={loadingIcon} />}
        </h1>
        <div className="posts">
          {!postsLoading
          && !mediaLoading
          && _.isEmpty(posts) && <p>No posts</p>}
          <Row gutter={20}>
            {_.isEmpty(postsError.FETCH_POSTS_ERROR)
            && _.isEmpty(mediaError.FETCH_MEDIA_ERROR)
            && !postsLoading
            && !mediaLoading
            && !_.isEmpty(media) &&
            posts.map(post =>
              (
                <Col key={post.id} span={3}>
                  <Post
                    post={post}
                    media={media.find(mediaItem =>
                      mediaItem.id === parseInt(getTmdbIdFromPost(post), 10)
                      && mediaItem.mediaType === getReviewTypeFromPost(post))}
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

export default connect(mapStateToProps, { fetchPosts })(PostsContainer);
