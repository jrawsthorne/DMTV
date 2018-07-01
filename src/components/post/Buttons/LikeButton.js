import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Spin } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../../actions/postActions';

import './LikeButton.less';

const LoadingIcon = <Icon type="loading" style={{ fontSize: 20 }} spin />;

class LikeButton extends React.Component {
  handleLikeClick = (isLiked) => {
    const { post: { author, permlink }, votePost } = this.props;
    let weight = 10000;
    if (isLiked) {
      weight = 0;
    }
    votePost(author, permlink, weight);
  }
  render() {
    const { userVote, pendingLike } = this.props;

    const postState = {
      isLiked: userVote.percent > 0,
    };

    if (pendingLike) return <Spin indicator={LoadingIcon} />;

    return (
      <Icon
        className="LikeButton"
        onClick={() => this.handleLikeClick(postState.isLiked)}
        style={{ fontSize: 20 }}
        type={postState.isLiked ? 'like' : 'like-o'}
      />
    );
  }
}

LikeButton.propTypes = {
  post: PropTypes.shape().isRequired,
  votePost: PropTypes.func.isRequired,
  userVote: PropTypes.shape(),
  pendingLike: PropTypes.shape(),
};

LikeButton.defaultProps = {
  userVote: {},
  pendingLike: null,
};

const mapStateToProps = (state, ownProps) => {
  const { active_votes: activeVotes, author, permlink } = ownProps.post;
  return {
    userVote: _.find(activeVotes, { voter: state.auth.user.name }),
    pendingLike: _.find(state.posts.pendingLikes, { postId: `@${author}/${permlink}` }),
  };
};

export default connect(mapStateToProps, { votePost: actions.votePost })(LikeButton);
