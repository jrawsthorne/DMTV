import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import Body from '../../helpers/bodyHelpers';
import CommentsContainer from '../../containers/CommentsContainer';
import './Comments.less';

const Comments = ({ comments }) =>
  comments.map((comment) => {
    if (comment.depth === 1) {
      return (
        <Card
          key={comment.id}
          style={{ marginBottom: 15 }}
          hoverable
          className="Comment"
        >
          <Card.Meta
            avatar={<div className="Comment__avatar" style={{ backgroundImage: `url(https://steemitimages.com/u/${comment.author}/avatar/large)` }} />}
            title={<Link to={`/@${comment.author}`}>{comment.author}</Link>}
            description={
              <div className="Comment__body">
                <Body body={comment.body} returnType="Object" />
                {/* if there are replies to the comment, show the replies */}
                {comment.children > 0 && <CommentsContainer
                  author={comment.author}
                  permlink={comment.permlink}
                  id={comment.id}
                  count={comment.children}
                />}
              </div>}
          />
        </Card>);
    }
    return (
      <Card.Meta
        style={{ padding: '10px 0' }}
        key={comment.id}
        avatar={<div className="Comment__avatar" style={{ backgroundImage: `url(https://steemitimages.com/u/${comment.author}/avatar/large)` }} />}
        title={<Link to={`/@${comment.author}`}>{comment.author}</Link>}
        description={
          <div className="Comment__body">
            <Body body={comment.body} returnType="Object" />
            {/* if there are replies to the comment, show the replies */}
            {comment.children > 0 && <CommentsContainer
              author={comment.author}
              permlink={comment.permlink}
              id={comment.id}
              count={comment.children}
            />}
          </div>}
      />
    );
  });

Comments.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape()),
};

Comments.defaultProps = {
  comments: [],
};

export default Comments;