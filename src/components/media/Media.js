import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import './Media.less';

const Media = props => (
  <div className="MediaItem">
    <div
      className="MediaItem__background"
      style={{ background: `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(${props.backdropPath})` }}
    >
      <div className="MediaHeader" style={{ position: 'relative' }}>
        {props.prev &&
          <Link to={props.prev} >
            <Icon
              type="left"
              className="prev-icon"
            />
          </Link>}
        <div className="MediaHeader__poster">
          <img alt="poster" src={props.poster} style={{ postition: 'absolute' }} />
        </div>
        <div className="MediaHeader__info">
          <div className="MediaHeader__info__title">
            {props.title}
          </div>
          <div className="MediaHeader__info__overview">{props.overview}</div>
        </div>
        {props.next &&
          <Link to={props.next} >
            <Icon
              type="right"
              className="next-icon"
            />
          </Link>}
      </div>
    </div>
  </div>
);

Media.propTypes = {
  title: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  backdropPath: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  next: PropTypes.string,
  prev: PropTypes.string,
};

Media.defaultProps = {
  next: undefined,
  prev: undefined,
};

export default Media;
