import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Carousel } from 'antd';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import ellipsis from 'text-ellipsis';
import { getMediaItemDetails } from '../../helpers/mediaHelpers';
import { getMediaStatusFromState } from '../../helpers/stateHelpers';
import CardLoading from '../post/CardLoading';
import { Body, Backdrop, MediaTitle } from '../post/PostPreview';
import './Similar.less';

/* show the backdrop, title and overview with link to its page */
export const SimilarItem = ({ item, url, mediaType }) => {
  const {
    title, overview,
  } = getMediaItemDetails(item, mediaType);
  return (
    <React.Fragment>
      <Link to={url}>
        <Backdrop path={item.backdrop_path} />
      </Link>
      <Body>
        <MediaTitle>
          <Link to={url}>{title}</Link>
        </MediaTitle>
        {ellipsis(overview, 200, { ellipsis: '…' })}
      </Body>
    </React.Fragment>
  );
};

const SimilarLoading = () => (
  <React.Fragment>
    <h2>Recommended</h2>
    <MediaQuery minWidth={1050}>
      {(matches) => {
          let num = 1;
          let centerPadding = '40px';
          /* if above 1050px */
          if (matches) {
            num = 2;
            centerPadding = '100px';
          }
          return (
            <Carousel
              slidesToShow={num}
              centerPadding={centerPadding}
              centerMode
              dots={false}
            >
              {/* add 3 loaders */}
              <CardLoading />
              <CardLoading />
              <CardLoading />
            </Carousel>
          );
      }}
    </MediaQuery>
  </React.Fragment>
);

const Similar = ({
  list, mediaType, fetching, failed, loaded,
}) => {
  if ((fetching || !loaded) && _.isEmpty(list)) return <SimilarLoading />;
  if (_.isEmpty(list) || failed) return null;
  return (
    <React.Fragment>
      <h2>Recommended</h2>
      <MediaQuery minWidth={1050}>
        {(matches) => {
          let num = 1;
          let centerPadding = '40px';
          let infinite = true;
          /* if above 1050px */
          if (matches) {
            num = 2;
            centerPadding = '100px';
          }
          if (list.length === 1) {
            infinite = false;
            centerPadding = '0px';
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
              centerPadding={centerPadding}
              centerMode
              lazyLoad
              infinite={infinite}
            >
              {/* for each item add it to the carousel */}
              {list.map(item => <SimilarItem key={item.id} mediaType={mediaType} item={item} url={`/${mediaType}/${item.id}`} />)}
            </Carousel>
          );
        }}
      </MediaQuery>
    </React.Fragment>
  );
};

Similar.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
  mediaType: PropTypes.string,
  fetching: PropTypes.bool.isRequired,
  failed: PropTypes.bool.isRequired,
  loaded: PropTypes.bool.isRequired,
};

Similar.defaultProps = {
  mediaType: null,
};

SimilarItem.propTypes = {
  item: PropTypes.shape().isRequired,
  url: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { tmdbid: id, mediaType } = ownProps;
  return {
    list: _.get(state, `media.items[${mediaType}s][${id}].similar`, []),
    mediaType,
    ...getMediaStatusFromState({ id, mediaType }, state.media.itemStates),
  };
};

export default connect(mapStateToProps, {})(Similar);
