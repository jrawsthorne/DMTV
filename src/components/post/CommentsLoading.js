import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';

const CommentsLoading = ({ root }) => (

  <Card
    hoverable
    className="Comment"
    loading
    style={{ border: !root && 'none' }}
  />
);

CommentsLoading.propTypes = {
  root: PropTypes.bool.isRequired,
};

export default CommentsLoading;
