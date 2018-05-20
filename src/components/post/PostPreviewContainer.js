import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';

import Post from './PostPreview';

class NewPostsContainer extends React.Component {
  static propTypes = {
    post: PropTypes.shape().isRequired,
  };
  render() {
    const { post } = this.props;
    const { media } = post;
    let { title } = media;
    let mediaUrl = `/${media.type}/${media.tmdbid}`;
    if (media.seasonNum) {
      title += ` S${media.seasonNum}`;
      mediaUrl += `/season/${media.seasonNum}`;
      if (media.episodeNum) {
        title += ` E${media.episodeNum}`;
        mediaUrl += `/episode/${media.episodeNum}`;
      }
    }
    const poster = media.episodePath || media.backdropPath || '';
    return (
      <div className="postsLayout__post">
        <Post
          overview={post.body}
          id={post.id}
          title={post.title}
          permlink={post.permlink}
          posterPath={poster}
          mediaTitle={title}
          author={post.author}
          url={`/${post.url}`}
          mediaUrl={mediaUrl}
          handleLikeClick={this.handleLikeClick}
          post={post}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  post: _.get(state, `posts.items[${ownProps.postId}]`, {}),
});

export default connect(mapStateToProps, null)(NewPostsContainer);
