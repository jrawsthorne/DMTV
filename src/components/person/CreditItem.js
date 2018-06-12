import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getMediaItemDetails } from '../../helpers/mediaHelpers';
import BodyShort from '../post/BodyShort';
import './Credits.less';

/* show the backdrop, title and overview with link to its page */
const CreditItem = ({ item, url, type }) => {
  const {
    backdropPath, title, overview,
  } = getMediaItemDetails(item, type);
  return (
    <React.Fragment>
      <Link to={url}>
        <div className="CreditItem__backdrop" style={{ height: 200, backgroundImage: `${backdropPath && `url(${backdropPath}`})`, backgroundColor: '#444' }} />
      </Link>
      <div className="CreditItem__body">
        <h2 style={{ marginBottom: 0 }}>
          <Link to={url}>{title}</Link>
        </h2>
        <BodyShort body={overview} />
      </div>
    </React.Fragment>
  );
};

CreditItem.propTypes = {
  item: PropTypes.shape().isRequired,
  url: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default CreditItem;
