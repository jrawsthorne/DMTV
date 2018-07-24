import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../../actions/postActions';
import { Button } from '../../../styles/theme';

import './LikeButton.less';

class LikeButton extends React.Component {
  handleLikeClick = (isLiked) => {
    const { post: { author, permlink }, votePost, type } = this.props;
    let weight = 10000;
    if (isLiked) {
      weight = 0;
    }
    votePost(author, permlink, type, weight);
  }
  render() {
    const {
      userVote, pendingLike, votes, isAuthenticated, margin,
    } = this.props;

    const upvotes = votes.filter(vote => vote.percent > 0).length;

    const postState = {
      isLiked: userVote.percent > 0,
    };

    return (
      <Button
        disabled={!isAuthenticated}
        loading={pendingLike}
        icon="like-o"
        type={postState.isLiked ? 'attention' : 'default'}
        onClick={() => this.handleLikeClick(postState.isLiked)}
        margin={margin}
        size="small"
      >
        {`${upvotes}` /* antd doesn't like numbers */}
      </Button>
    );
  }
}

LikeButton.propTypes = {
  post: PropTypes.shape().isRequired,
  votePost: PropTypes.func.isRequired,
  userVote: PropTypes.shape(),
  pendingLike: PropTypes.shape(),
  type: PropTypes.string,
  votes: PropTypes.arrayOf(PropTypes.shape()),
  isAuthenticated: PropTypes.bool.isRequired,
  margin: PropTypes.string,
};

LikeButton.defaultProps = {
  userVote: {},
  pendingLike: null,
  type: 'post',
  votes: [],
  margin: '0',
};

const mapStateToProps = (state, ownProps) => {
  const { active_votes: activeVotes, author, permlink } = ownProps.post;
  return {
    userVote: _.find(activeVotes, { voter: state.auth.user.name }),
    pendingLike: _.find(state.posts.pendingLikes, { postId: `@${author}/${permlink}` }),
    isAuthenticated: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps, { votePost: actions.votePost })(LikeButton);
