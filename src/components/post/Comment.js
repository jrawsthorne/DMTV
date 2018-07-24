import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Body from '../../helpers/bodyHelpers';
import CommentContainer from '../../containers/CommentContainer';
import LikeButton from './Buttons/LikeButton';
import ReplyButton from './Buttons/ReplyButton';
import CommentsLoading from './CommentsLoading';
import ReplyBox from './ReplyBox';
import ShowRepliesButton from './Buttons/ShowRepliesButton';
import './Comments.less';

const StyledReply = styled.div`
  padding: ${props => (props.root ? '20px' : '0')};
  background: #fff;
  box-shadow: ${props => (props.root ? '0 0 41px 0 #e0e0e3, 0 0 0 0 #babdce' : 'none')};
  margin-bottom: 20px;
  border-radius: 4px;
`;

const ReplyMeta = ({ root, ...restProps }) => <Card.Meta {...restProps} />;

ReplyMeta.propTypes = {
  root: PropTypes.bool,
};

ReplyMeta.defaultProps = {
  root: false,
};

const StyledReplyMeta = styled(ReplyMeta)`
  margin: ${props => (props.root ? '0' : '20px 0 0 0')};
`;

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
  const replyCount = comment.children;
  const loadedReplyCount = replies.length;
  return (
    <StyledReplyMeta
      root={root}
      avatar={<Link to={`/@${comment.author}`}><span className="Comment__avatar" style={{ backgroundImage: `url(https://steemitimages.com/u/${comment.author}/avatar/large)` }} /></Link>}
      title={<Link to={`/@${comment.author}`}>{comment.author}</Link>}
      description={
        <div className="Comment__body">
          <Body body={comment.body} returnType="Object" />
          <LikeButton post={comment} type="comment" votes={comment.active_votes} />
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
      <StyledReply root>
        <NestedReply {...props} />
      </StyledReply>);
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
