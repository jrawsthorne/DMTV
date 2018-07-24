import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../../styles/theme';

const CommentButton = ({ count }) => (
  <Button
    icon="message"
    type="info"
    size="small"
  >
    {`${count}` /* antd doesn't like numbers */}
  </Button>
);

CommentButton.propTypes = {
  count: PropTypes.number.isRequired,
};

export default CommentButton;
