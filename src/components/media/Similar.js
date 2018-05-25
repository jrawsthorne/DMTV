import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Carousel } from 'antd';
import { Link } from 'react-router-dom';
import Loading from '../misc/Loading';
import BodyShort from '../post/BodyShort';

const SimilarItem = ({ item, url }) => (
  <React.Fragment>
    <Link to={url}>
      <div className="SimilarPreviewBackdrop" style={{ height: 200, backgroundImage: `url(${item.backdrop_path && `https://image.tmdb.org/t/p/original${item.backdrop_path}`})` }} />
    </Link>
    <div className="SimilarPreviewBody">
      <h2 style={{ marginBottom: 0 }}>
        <Link to={url}>{item.title || item.name}</Link>
      </h2>
      <BodyShort body={item.overview} length={400} />
    </div>
  </React.Fragment>
);


const Similar = ({
  list, fetching, loaded, failed, type,
}) => {
  if (fetching || !loaded) return <Loading />;
  if (failed) return 'Sorry, there was an error fetching recommendations';
  return (
    <React.Fragment>
      <h2>Recommended</h2>
      <Carousel autoplay>
        {list.map(item => <SimilarItem key={item.id} item={item} url={`/${type}/${item.id}`} />)}
      </Carousel>
    </React.Fragment>
  );
};

Similar.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
  fetching: PropTypes.bool.isRequired,
  loaded: PropTypes.bool.isRequired,
  failed: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

SimilarItem.propTypes = {
  item: PropTypes.shape().isRequired,
  url: PropTypes.string.isRequired,
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
    fetching: _.get(state, `media.itemStates[${type}s][${id}].similar.fetching`, false),
    loaded: _.get(state, `media.itemStates[${type}s][${id}].similar.loaded`, false),
    failed: _.get(state, `media.itemStates[${type}s][${id}].similar.failed`, false),
    list: _.get(state, `media.items[${type}s][${id}].similar`, []),
    type: type || '',
  };
};

export default connect(mapStateToProps, {})(Similar);
