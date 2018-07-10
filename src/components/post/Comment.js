import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import Body from '../../helpers/bodyHelpers';
import CommentContainer from '../../containers/CommentContainer';
import LikeButton from './Buttons/LikeButton';
import Upvotes from './Counts/Upvotes';
import CommentButton from './Buttons/CommentButton';
import CommentCount from './Counts/CommentCount';
import ReplyButton from './Buttons/ReplyButton';
import CommentsLoading from './CommentsLoading';
import ReplyBox from './ReplyBox';
import ShowRepliesButton from './Buttons/ShowRepliesButton';
import './Comments.less';

const NestedReply = ({
  comment,
  replies,
  handleShowRepliesClick,
  handleShowReplyBoxClick,
  showReplyBox,
  showReplies,
  fetching,
  isAuthenticated,
}) => {
  const root = comment.depth === 1;
  let styles;
  if (!root) {
    styles = { padding: '20px 0 10px 0' };
  }
  const replyCount = comment.children;
  const loadedReplyCount = replies.length;
  return (
    <Card.Meta
      style={styles}
      avatar={<div className="Comment__avatar" style={{ backgroundImage: `url(https://steemitimages.com/u/${comment.author}/avatar/large)` }} />}
      title={<Link to={`/@${comment.author}`}>{comment.author}</Link>}
      description={
        <div className="Comment__body">
          <Body body={comment.body} returnType="Object" />
          <LikeButton post={comment} type="comment" />
          <Upvotes votes={comment.active_votes} />
          {replyCount > 0 && (
          <React.Fragment>
            <CommentButton post={comment} />
            <CommentCount count={comment.children} />
          </React.Fragment>
                )}
          {isAuthenticated && <ReplyButton
            parentAuthor={comment.author}
            parentPermlink={comment.permlink}
            handleShowClick={handleShowReplyBoxClick}
            showReplyBox={showReplyBox}
          />}
          {!showReplies && replyCount > 0 && loadedReplyCount === 0 && <ShowRepliesButton
            handleShowRepliesClick={handleShowRepliesClick}
            count={comment.children}
          />}
          {isAuthenticated && showReplyBox && <ReplyBox
            parentPermlink={comment.permlink}
            parentAuthor={comment.author}
            parentId={comment.id}
            toggleReplyBox={handleShowReplyBoxClick}
          />}
          {showReplies && loadedReplyCount === 0 && fetching && <CommentsLoading />}
          {loadedReplyCount > 0 && (
                  replies.map(reply =>
                    <CommentContainer key={reply.id} comment={reply} />)
                )}
        </div>}
    />
  );
};

/* only show a border around root comments */
const Comment = (props) => {
  if (props.comment.depth === 1) {
    return (
      <Card
        style={{ marginBottom: 15 }}
        hoverable
        className="Comment"
      >
        <NestedReply {...props} />
      </Card>);
  }
  return <NestedReply {...props} />;
};

Comment.propTypes = {
  comment: PropTypes.shape().isRequired,
  replies: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleShowRepliesClick: PropTypes.func.isRequired,
  handleShowReplyBoxClick: PropTypes.func.isRequired,
  showReplyBox: PropTypes.bool.isRequired,
  showReplies: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

NestedReply.propTypes = {
  comment: PropTypes.shape().isRequired,
  replies: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleShowRepliesClick: PropTypes.func.isRequired,
  handleShowReplyBoxClick: PropTypes.func.isRequired,
  showReplyBox: PropTypes.bool.isRequired,
  showReplies: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

export default Comment;
