import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Row, Col } from 'antd';
import Loadable from 'react-loadable';
import { Link } from 'react-router-dom';
import './Media.less';
import BodyShort from '../post/BodyShort';

const SubscribeButton = Loadable({
  loader: () => import('./SubscribeButton'),
  loading: (() => null),
});
const StarRating = Loadable({
  loader: () => import('./StarRating'),
  loading: (() => null),
});
const LoginLink = Loadable({
  loader: () => import('../misc/LoginLink'),
  loading: (() => null),
});
const SelectorPopover = Loadable({
  loader: () => import('./SelectorPopover'),
  loading: (() => null),
});

const Media = props => (
  <div className="MediaItem">
    <div className="MediaItem__backdrop" style={{ background: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(${props.backdropPath})` }} />
    <div className="MediaHeader">
      {props.prev &&
        <Link className="prev-next" to={props.prev} >
          <Icon
            type="left"
            className="prev-icon"
          />
        </Link>}
      <div className="MediaHeader__poster">
        <img alt="" src={props.poster} />
        {props.isAuthenticated ?
          <React.Fragment>
            <div className="MediaHeader__info__subscribe">
              <SubscribeButton
                tmdbid={props.tmdbid}
                mediaType={props.mediaType}
              />
            </div>
            <div className="MediaHeader__info__rating">
              <h4>Rating</h4>
              <StarRating
                tmdbid={props.tmdbid}
                mediaType={props.mediaType}
                seasonNum={props.seasonNum}
                episodeNum={props.episodeNum}
              />
            </div>
          </React.Fragment>
          :
          <React.Fragment>
            <h4>Rating</h4>
            <LoginLink linkText="Log in to rate" />
          </React.Fragment>
        }
      </div>
      <div className="MediaHeader__info">
        <div className="MediaHeader__info__title">
          {props.title}
        </div>
        {(props.mediaType === 'season' || props.mediaType === 'episode') &&
          <div className="MediaHeader__info__links">
            <Link to={`/show/${props.tmdbid}`} >
              <Icon type="arrow-left" /> {props.mediaItem.title}
            </Link>
            {props.mediaType === 'episode' && (
              <Link to={`/show/${props.tmdbid}/season/${props.seasonNum}`} >
                <Icon type="arrow-left" /> {props.mediaItem.seasons[props.seasonNum].name}
              </Link>
            )}
          </div>
        }
        <Row gutter={32} type="flex">
          <Col xs={24} sm={24} lg={14}>
            <div className="MediaHeader__info__overview">
              <h4>Overview</h4>
              <BodyShort body={props.overview} />
            </div>
            <SelectorPopover type="season" list={props.seasons} tmdbid={props.tmdbid} seasonNum={props.seasonNum} />
            <SelectorPopover type="episode" list={props.episodes} tmdbid={props.tmdbid} seasonNum={props.seasonNum} />
          </Col>
          <Col xs={24} sm={24} lg={10}>
            <div className="MediaHeader__info__actors">
              <h4>Actors</h4>
              {props.actors.map(actor => (
                <p key={actor.credit_id}>{actor.name} as {actor.character}</p>
              ))}
              {props.actors.length === 0 && <p>No actors found</p>}
            </div>
            <div className="MediaHeader__info__genres">
              <h4>Genres</h4>
              <p>{props.genres.map(genre => genre.name).join(', ')}</p>
              {props.genres.length === 0 && <p>No genres found</p>}
            </div>
          </Col>
        </Row>
      </div>
      {props.next &&
        <Link className="prev-next" to={props.next} >
          <Icon
            type="right"
            className="next-icon"
          />
        </Link>}
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
  episodes: PropTypes.shape(),
  seasons: PropTypes.shape(),
  tmdbid: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  seasonNum: PropTypes.string,
  episodeNum: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
  actors: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  genres: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  mediaItem: PropTypes.shape().isRequired,
};

Media.defaultProps = {
  next: undefined,
  prev: undefined,
  episodes: undefined,
  seasons: undefined,
  seasonNum: undefined,
  episodeNum: undefined,
};

export default Media;
