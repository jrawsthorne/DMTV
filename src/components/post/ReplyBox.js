import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Input, Card, Form, Button } from 'antd';
import { Link } from 'react-router-dom';
import * as actions from '../../actions/commentsActions';
import Body from '../../helpers/bodyHelpers';

const FormItem = Form.Item;

class ReplyInput extends React.Component {
  handleSubmit = (e) => {
    const {
      parentAuthor,
      parentPermlink,
      parentId,
      form: {
        validateFieldsAndScroll,
        resetFields,
      },
      toggleReplyBox,
    } = this.props;
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.submitComment(
          parentAuthor,
          parentPermlink,
          parentId,
          values.body,
        ).then(() => {
          resetFields();
          toggleReplyBox();
        });
      }
    });
  }
  render() {
    const {
      broadcasting,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const body = getFieldValue('body');
    return (
      <Form hideRequiredMark onSubmit={this.handleSubmit}>
        <FormItem className="Body" placeholder="Enter your comment">
          {getFieldDecorator('body', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: 'Body can\'t be empty',
                  },
                ],
              })(<Input.TextArea />)}
        </FormItem>
        {!_.isEmpty(body) && <h2>Preview</h2>}
        {<Body body={body} returnType="Object" />}
        <Form.Item>
          <Button loading={broadcasting} htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    );
  }
}

const ReplyBox = ({
  username,
  isAuthenticated,
  broadcasting,
  form,
  submitComment,
  parentAuthor,
  parentPermlink,
  parentId,
  toggleReplyBox,
}) => {
  if (isAuthenticated) {
    return (<Card.Meta
      style={{ padding: '20px 0 10px 0' }}
      avatar={<div className="Comment__avatar" style={{ backgroundImage: `url(https://steemitimages.com/u/${username}/avatar/large)` }} />}
      title={<Link to={`/@${username}`}>{username}</Link>}
      description={<ReplyInput
        form={form}
        broadcasting={broadcasting}
        submitComment={submitComment}
        parentAuthor={parentAuthor}
        parentPermlink={parentPermlink}
        parentId={parentId}
        toggleReplyBox={toggleReplyBox}
      />}
    />);
  }
  return null;
};

ReplyBox.propTypes = {
  username: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  broadcasting: PropTypes.bool.isRequired,
  form: PropTypes.shape().isRequired,
  submitComment: PropTypes.func.isRequired,
  parentAuthor: PropTypes.string.isRequired,
  parentPermlink: PropTypes.string.isRequired,
  parentId: PropTypes.number.isRequired,
  toggleReplyBox: PropTypes.func,
};

ReplyInput.propTypes = {
  form: PropTypes.shape().isRequired,
  broadcasting: PropTypes.bool.isRequired,
  submitComment: PropTypes.func.isRequired,
  parentAuthor: PropTypes.string.isRequired,
  parentPermlink: PropTypes.string.isRequired,
  parentId: PropTypes.number.isRequired,
  toggleReplyBox: PropTypes.func,
};

ReplyInput.defaultProps = {
  toggleReplyBox: () => null,
};

ReplyBox.defaultProps = {
  toggleReplyBox: () => null,
};

const mapStateToProps = (state, ownProps) => ({
  username: _.get(state, 'auth.user.name', ''),
  isAuthenticated: state.auth.isAuthenticated,
  broadcasting: _.includes(state.comments.pendingComments, ownProps.parentId),
});

const mapDispatchToProps = {
  submitComment: actions.submitComment,
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ReplyBox));
