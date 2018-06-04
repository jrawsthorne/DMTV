import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Carousel } from 'antd';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import { getMediaItemDetails } from '../../helpers/mediaHelpers';
import BodyShort from '../post/BodyShort';

export const SimilarItem = ({ item, url, type }) => {
  const {
    backdropPath, title, overview,
  } = getMediaItemDetails(item, type);
  return (
    <React.Fragment>
      <Link to={url}>
        <div className="SimilarPreviewBackdrop" style={{ height: 200, backgroundImage: `${backdropPath && `url(${backdropPath}`})`, backgroundColor: '#444' }} />
      </Link>
      <div className="SimilarPreviewBody">
        <h2 style={{ marginBottom: 0 }}>
          <Link to={url}>{title}</Link>
        </h2>
        <BodyShort body={overview} />
      </div>
    </React.Fragment>
  );
};

const Similar = ({
  list, type,
}) => {
  if (_.isEmpty(list)) return null;
  return (
    <React.Fragment>
      <h2>Recommended</h2>
      <MediaQuery minWidth={1050}>
        {(matches) => {
          let num = 1;
          let padding = '40px';
          if (matches) {
            num = 2;
            padding = '100px';
          }
          return (
            <Carousel
              autoplay
              autoplaySpeed={5000}
              slidesToShow={num}
              pauseOnHover
              draggable
              swipeToSlide
              swipe
              centerPadding={padding}
              centerMode
              lazyLoad
            >
              {list.map(item => <SimilarItem key={item.id} type={type} item={item} url={`/${type}/${item.id}`} />)}
            </Carousel>
          );
        }}
      </MediaQuery>
    </React.Fragment>
  );
};

Similar.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
  type: PropTypes.string.isRequired,
};

SimilarItem.propTypes = {
  item: PropTypes.shape().isRequired,
  url: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const {
    author, permlink, tmdbid, mediaType,
  } = ownProps;
  let type;
  let id;
  if (!mediaType && !tmdbid) {
    const post = _.get(state, `posts.items[@${author}/${permlink}].media`, {});
    ({ type, tmdbid: id } = post);
  } else {
    type = mediaType;
    id = tmdbid;
  }
  return {
    list: _.get(state, `media.items[${type}s][${id}].similar`, []),
    type: type || '',
  };
};

export default connect(mapStateToProps, {})(Similar);
