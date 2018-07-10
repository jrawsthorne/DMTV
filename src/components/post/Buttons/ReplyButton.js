import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const ReplyButton = ({
  handleShowClick, showReplyBox,
}) => (
  <Button onClick={handleShowClick} style={{ marginLeft: 10 }}>{showReplyBox ? 'Close' : 'Reply'}</Button>
);

ReplyButton.propTypes = {
  handleShowClick: PropTypes.func.isRequired,
  showReplyBox: PropTypes.bool.isRequired,
};

export default ReplyButton;
