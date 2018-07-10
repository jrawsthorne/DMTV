import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const ShowRepliesButton = ({
  handleShowRepliesClick, count,
}) => (
  <Button style={{ marginLeft: 10 }} onClick={handleShowRepliesClick}>View {count} {count === 1 ? 'reply' : 'replies'}</Button>
);

ShowRepliesButton.propTypes = {
  handleShowRepliesClick: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
};

export default ShowRepliesButton;
