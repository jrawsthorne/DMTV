import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../../styles/theme';

const ShowRepliesButton = ({
  handleShowRepliesClick, count, className,
}) => (
  <Button className={className} margin="0 0 0 10px" size="small" onClick={handleShowRepliesClick}>View {count} {count === 1 ? 'reply' : 'replies'}</Button>
);

ShowRepliesButton.propTypes = {
  handleShowRepliesClick: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  className: PropTypes.string,
};

ShowRepliesButton.defaultProps = {
  className: null,
};

export default ShowRepliesButton;
