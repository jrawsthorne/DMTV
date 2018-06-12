import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Carousel } from 'antd';
import MediaQuery from 'react-responsive';
import CreditItem from './CreditItem';

const KnownFor = ({
  list,
}) => {
  if (_.isEmpty(list)) return null;
  return (
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
              {list.map(item => <CreditItem key={item.id} type={`${item.media_type === 'movie' ? 'movie' : 'show'}`} item={item} url={`/${item.media_type === 'movie' ? 'movie' : 'show'}/${item.id}`} />)}
            </Carousel>
          );
        }}
    </MediaQuery>
  );
};

KnownFor.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
};

export default KnownFor;
