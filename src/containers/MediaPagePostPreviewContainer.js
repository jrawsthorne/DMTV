import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPost } from '../reducers';

import MediaPagePostPreview from '../components/post/MediaPagePostPreview';

class MediaPagePostPreviewContainer extends React.Component {
  static propTypes = {
    post: PropTypes.shape().isRequired,
  };
  render() {
    const { post } = this.props;
    const { media } = post;
    const backdropPath = media.episodePath || media.backdropPath || '';
    return (
      <div className="postsLayout__post">
        <MediaPagePostPreview
          overview={post.body}
          id={post.id}
          title={post.title}
          permlink={post.permlink}
          backdropPath={backdropPath}
          author={post.author}
          url={`/${post.url}`}
          handleLikeClick={this.handleLikeClick}
          post={post}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  /* get post with specified ID from store */
  post: getPost(state, ownProps.postId),
});

export default connect(mapStateToProps, null)(MediaPagePostPreviewContainer);
