import React from 'react';
import PropTypes from 'prop-types';

const Similar = ({ list, type }) =>
  (
    <div><h1>{type}</h1>
      {list.map(item => item.title)}
    </div>
  );

Similar.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape().isRequired),
  type: PropTypes.string.isRequired,
};

Similar.defaultProps = {
  list: undefined,
};

export default Similar;
