import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import styled from 'styled-components';

const Loading = ({ root, ...restProps }) => <Card {...restProps} />;

Loading.propTypes = {
  root: PropTypes.bool,
};

Loading.defaultProps = {
  root: false,
};

const StyledCommentsLoading = styled(Loading)`
  .ant-card-body {
    padding: ${props => (props.root ? '24px' : '0')};
    box-shadow: ${props => (props.root ? '0 0 41px 0 #e0e0e3, 0 0 0 0 #babdce' : 'none')};
    border-radius: ${props => (props.root ? '4px' : '0')};
  }
  margin-bottom: ${props => (props.root ? '20px' : '0')};
  margin-top: ${props => (!props.root ? '20px' : '0')};
`;

const CommentsLoading = ({ root }) => (
  <StyledCommentsLoading
    className="Comment"
    loading
    root={root}
    bordered={false}
  />
);

CommentsLoading.propTypes = {
  root: PropTypes.bool,
};

CommentsLoading.defaultProps = {
  root: false,
};

export default CommentsLoading;
