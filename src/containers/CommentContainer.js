import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchReplies } from '../actions/commentsActions';
import Comment from '../components/post/Comment';

class CommentContainer extends React.Component {
  static propTypes = {
    fetchReplies: PropTypes.func.isRequired,
    fetching: PropTypes.bool.isRequired,
    comment: PropTypes.shape().isRequired,
    replies: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  };
  /* don't show the replies initially */
  state = {
    showReplies: false,
    showReplyBox: false,
  }
  componentDidMount() {
    const {
      comment: {
        author, permlink, id, children: { count },
      }, fetching, replies,
    } = this.props;
    const { showReplies } = this.state;
    if (showReplies && !fetching && count > 0 && replies.length === 0) {
      this.props.fetchReplies(
        author,
        permlink,
        id,
      );
    }
  }
  componentDidUpdate(prevProps) {
    const {
      fetching, comment: {
        author, permlink, id, children: { count },
      }, replies,
    } = this.props;
    const { id: prevId } = prevProps;
    const { showReplies } = this.state;
    if (showReplies && !fetching && count > 0 && id !== prevId && replies.length === 0) {
      this.props.fetchReplies(
        author,
        permlink,
        id,
      );
    }
  }
  handleShowRepliesClick = () => {
    const {
      comment: {
        author, permlink, id,
      },
    } = this.props;
    /* set the showReplies state and fetch the replies */
    this.setState({ showReplies: true }, () => this.props.fetchReplies(
      author,
      permlink,
      id,
    ));
  }
  handleShowReplyBoxClick = () => {
    const { showReplyBox } = this.state;
    /* toggle the showReplyBox state */
    this.setState({ showReplyBox: !showReplyBox });
  }
  render() {
    const {
      fetching, replies, comment, isAuthenticated,
    } = this.props;
    const { showReplies, showReplyBox } = this.state;
    return (<Comment
      replies={replies}
      comment={comment}
      handleShowRepliesClick={this.handleShowRepliesClick}
      handleShowReplyBoxClick={this.handleShowReplyBoxClick}
      showReplyBox={showReplyBox}
      showReplies={showReplies}
      fetching={fetching}
      isAuthenticated={isAuthenticated}
    />);
  }
}

const mapStateToProps = (state, ownProps) => ({
  replies: _.get(state.comments.childrenById, ownProps.comment.id, []).map(postId =>
    state.comments.comments[postId]),
  fetching: _.includes(state.comments.fetching, ownProps.comment.id),
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { fetchReplies })(CommentContainer);
