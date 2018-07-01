import React from 'react';
import PropTypes from 'prop-types';

const Upvotes = ({ votes }) => {
  const upvotes = votes.filter(vote => vote.percent > 0).length;

  return (
    <span style={{ marginLeft: 5 }}>{upvotes}</span>
  );
};

Upvotes.propTypes = {
  votes: PropTypes.arrayOf(PropTypes.shape()),
};

Upvotes.defaultProps = {
  votes: {},
};

export default Upvotes;
