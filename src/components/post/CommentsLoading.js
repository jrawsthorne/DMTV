import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';

const CommentsLoading = ({ root }) => (
  <Card
    hoverable
    className="Comment"
    loading
    bordered={root}
  />
);

CommentsLoading.propTypes = {
  root: PropTypes.bool,
};

CommentsLoading.defaultProps = {
  root: false,
};

export default CommentsLoading;
