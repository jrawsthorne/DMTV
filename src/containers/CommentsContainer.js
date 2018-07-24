import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Button } from '../styles/theme';
import { fetchReplies } from '../actions/commentsActions';
import Comment from './CommentContainer';
import CommentsLoading from '../components/post/CommentsLoading';
import ShowRepliesButton from '../components/post/Buttons/ShowRepliesButton';

const RootShowRepliesButton = styled(ShowRepliesButton)`
  margin: 0 0 20px 0;
`;

class CommentsContainer extends React.Component {
  /* don't show the replies initially */
  state = {
    showReplies: false,
  }
  componentDidMount() {
    const {
      author, permlink, id, count, fetching, replies,
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
      fetching, author, permlink, id, count, replies,
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
    const { author, permlink, id } = this.props;
    /* set the showReplies state and fetch the replies */
    this.setState({ showReplies: true }, () => this.props.fetchReplies(
      author,
      permlink,
      id,
    ));
  }
  render() {
    const {
      fetching, replies, count,
    } = this.props;
    const { showReplies } = this.state;
    if (count === 0 && replies.length === 0) {
      return (
        <div>
          <Button margin="0 0 20px 0" size="small">No comments</Button>
        </div>
      );
    }

    /* if comments already loaded show them */
    /* this means expanded comments maintain state on page changes */
    if (replies.length > 0) {
      return _.orderBy(replies, 'created', 'desc').map(comment =>
        <Comment key={comment.id} comment={comment} />);
    }
    /*
     * show loading if there are currently no replies, replies are being fetched
     * and replies should be shown
    */
    if (showReplies && replies.length === 0 && fetching) return <CommentsLoading root />;
    /* otherwise show a link to view the replies */
    return (
      <div>
        <RootShowRepliesButton
          handleShowRepliesClick={this.handleShowRepliesClick}
          count={count}
        />
      </div>
    );
  }
}

CommentsContainer.propTypes = {
  fetchReplies: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  author: PropTypes.string.isRequired,
  permlink: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  replies: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  replies: _.get(state.comments.childrenById, ownProps.id, []).map(postId =>
    state.comments.comments[postId]),
  fetching: _.includes(state.comments.fetching, ownProps.id),
});

export default connect(mapStateToProps, { fetchReplies })(CommentsContainer);
