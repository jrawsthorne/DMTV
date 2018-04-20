import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import './Media.less';

const Movie = props => (
  <div className="MediaItem">
    <div
      className="MediaItem__background"
      style={{ background: `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(${props.backdropPath})` }}
    >
      <div className="MediaHeader">
        <div className="MediaHeader__poster">
          <img alt="poster" src={props.poster} style={{ postition: 'absolute' }} />
        </div>
        <div className="MediaHeader__info">
          <div className="MediaHeader__info__title">
            {props.title}
          </div>
          <div className="MediaHeader__info__overview">{props.overview}</div>
        </div>
      </div>
    </div>
  </div>
);

Movie.propTypes = {
  title: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  backdropPath: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
};

export default withRouter(Movie);
