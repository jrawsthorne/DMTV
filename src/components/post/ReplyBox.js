import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Form, Icon } from 'antd';
import { Button, TextArea, FormItem, Tooltip } from '../../styles/theme';
import * as actions from '../../actions/commentsActions';
import styled, { css } from '../../../node_modules/styled-components';

const StyledReplyBox = styled.div`
  padding: ${props => (props.root ? '20px' : '0')};
  background: #fff;
  box-shadow: ${props => (props.root ? '0 0 41px 0 #e0e0e3, 0 0 0 0 #babdce' : 'none')};
  margin-top: ${props => (props.root ? '0' : '20px')};
  ${props => props.root && css`
    margin-bottom: 20px;
  `}
  border-radius: 4px;
`;

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
          toggleReplyBox();
          resetFields();
        });
      }
    });
  }
  render() {
    const {
      broadcasting,
      form: {
        getFieldDecorator, getFieldError, getFieldValue, isFieldTouched,
      },
      root,
    } = this.props;

    const touched = isFieldTouched('body');
    const empty = !getFieldValue('body');
    const error = getFieldError('body');
    const isError = !!getFieldError('body');

    return (
      <Form hideRequiredMark onSubmit={this.handleSubmit} style={{ paddingLeft: 21 }}>
        <FormItem margin="0 0 10px 0" placeholder="Enter your comment">
          {getFieldDecorator('body', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: 'Comment can\'t be empty',
                  },
                ],
              })(<TextArea placeholder="Enter your comment" autoFocus={!root} autosize={{ minRows: 3, maxRows: 6 }} />)}
        </FormItem>
        <FormItem>
          <Tooltip type={isError && 'error'} placement="right" title={error}>
            <Button
              icon={isError ? 'warning' : 'message'}
              type={isError ? 'error' : 'default'}
              disabled={empty && !touched}
              loading={broadcasting}
              htmlType="submit"
              size="small"
            >
              {isError ? 'Error' : 'Submit'}
            </Button>
          </Tooltip>
        </FormItem>
      </Form>
    );
  }
}

/*
<StyledReplyBox
      avatar={<Link to={`/@${username}`}><div className="Comment__avatar" style={{ backgroundImage: `url(https://steemitimages.com/u/${username}/avatar/large)` }} /></Link>}
      description={<ReplyInput
        form={form}
        broadcasting={broadcasting}
        submitComment={submitComment}
        parentAuthor={parentAuthor}
        parentPermlink={parentPermlink}
        parentId={parentId}
        toggleReplyBox={toggleReplyBox}
      />}
    />
    */

const ReplyBox = ({
  isAuthenticated,
  broadcasting,
  form,
  submitComment,
  parentAuthor,
  parentPermlink,
  parentId,
  toggleReplyBox,
  root,
}) => {
  if (isAuthenticated) {
    return (
      <StyledReplyBox root={root}>
        <p style={{ color: '#bebedb', fontWeight: 'bold', marginBottom: 5 }}><Icon type="rollback" style={{ marginRight: 5 }} />Reply {parentAuthor} </p>
        <ReplyInput
          form={form}
          broadcasting={broadcasting}
          submitComment={submitComment}
          parentAuthor={parentAuthor}
          parentPermlink={parentPermlink}
          parentId={parentId}
          toggleReplyBox={toggleReplyBox}
          root={root}
        />
      </StyledReplyBox>
    );
  }
  return null;
};

ReplyBox.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  broadcasting: PropTypes.bool.isRequired,
  form: PropTypes.shape().isRequired,
  submitComment: PropTypes.func.isRequired,
  parentAuthor: PropTypes.string.isRequired,
  parentPermlink: PropTypes.string.isRequired,
  parentId: PropTypes.number.isRequired,
  toggleReplyBox: PropTypes.func,
  root: PropTypes.bool,
};

ReplyInput.propTypes = {
  form: PropTypes.shape().isRequired,
  broadcasting: PropTypes.bool.isRequired,
  submitComment: PropTypes.func.isRequired,
  parentAuthor: PropTypes.string.isRequired,
  parentPermlink: PropTypes.string.isRequired,
  parentId: PropTypes.number.isRequired,
  toggleReplyBox: PropTypes.func,
  root: PropTypes.bool,
};

ReplyInput.defaultProps = {
  toggleReplyBox: () => null,
  root: false,
};

ReplyBox.defaultProps = {
  toggleReplyBox: () => null,
  root: false,
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
