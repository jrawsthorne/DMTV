import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../../styles/theme';

const StyledReplyButton = Button.extend`
  margin-left: 10px;
`;

const ReplyButton = ({
  handleShowClick, showReplyBox,
}) => (
  <StyledReplyButton size="small" type={showReplyBox ? 'info' : 'default'} onClick={handleShowClick}>{showReplyBox ? 'Close' : 'Reply'}</StyledReplyButton>
);

ReplyButton.propTypes = {
  handleShowClick: PropTypes.func.isRequired,
  showReplyBox: PropTypes.bool.isRequired,
};

export default ReplyButton;
