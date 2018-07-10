import React from 'react';
import PropTypes from 'prop-types';

const CommentCount = ({ count }) => (
  <span style={{ marginLeft: 5 }}>{count}</span>
);

CommentCount.propTypes = {
  count: PropTypes.number.isRequired,
};

export default CommentCount;
