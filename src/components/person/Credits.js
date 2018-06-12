import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import CreditItem from './CreditItem';

const Credits = ({
  list,
}) => {
  if (_.isEmpty(list)) return null;
  return list.map(item => (
    <div key={item.id} className="CreditItem">
      <CreditItem
        type={`${item.media_type === 'movie' ? 'movie' : 'show'}`}
        item={item}
        url={`/${item.media_type === 'movie' ? 'movie' : 'show'}/${item.id}`}
      />
    </div>
  ));
};

Credits.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
};

export default Credits;
