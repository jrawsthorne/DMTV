import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Row, Col } from 'antd';
import Loadable from 'react-loadable';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';
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

const AuthActions = ({
  tmdbid, mediaType, seasonNum, episodeNum, isAuthenticated,
}) => {
  if (isAuthenticated) {
    return (
      <React.Fragment>
        <div className="MediaHeader__info__subscribe">
          <SubscribeButton
            tmdbid={tmdbid}
            mediaType={mediaType}
          />
        </div>
        <div className="MediaHeader__info__rating">
          <h4>Rating</h4>
          <StarRating
            tmdbid={tmdbid}
            mediaType={mediaType}
            seasonNum={seasonNum}
            episodeNum={episodeNum}
          />
        </div>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <div className="MediaHeader__info__rating">
        <h4>Rating</h4>
        <LoginLink linkText="Log in to rate" />
      </div>
    </React.Fragment>);
};

const Genres = ({ genres }) => (
  <div className="MediaHeader__info__genres">
    <h4>Genres</h4>
    <p>{genres.map(genre => genre.name).join(', ')}</p>
    {genres.length === 0 && <p>No genres found</p>}
  </div>
);

const Actors = ({ actors }) => (
  <div className="MediaHeader__info__actors">
    <h4>Actors</h4>
    {actors.map(actor => (
      <p key={actor.credit_id}>{actor.name} as {actor.character}</p>
    ))}
    {actors.length === 0 && <p>No actors found</p>}
  </div>
);

const Switcher = ({ link, direction }) => {
  if (link) {
    return (
      <Link className="prev-next" to={link} >
        <Icon
          type={direction === 'left' ? 'left' : 'right'}
          className={`${direction === 'left' ? 'prev' : 'next'}-icon`}
        />
      </Link>
    );
  }
  return null;
};

const Links = ({
  mediaType, tmdbid, seasonNum, mediaItem, isPostPage,
}) => {
  if (mediaType === 'season' || mediaType === 'episode') {
    return (
      <div className="MediaHeader__info__links">
        <Link to={`/show/${tmdbid}`} >
          <Icon type="arrow-left" /> {mediaItem.title}
        </Link>
        {mediaType === 'episode' && (
          <Link to={`/show/${tmdbid}/season/${seasonNum}`} >
            <Icon type="arrow-left" /> {mediaItem.seasons[seasonNum].name}
          </Link>
        )}
      </div>
    );
  } else if (isPostPage) {
    return (
      <div className="MediaHeader__info__links">
        <Link to={`/${mediaType}/${tmdbid}`} >
          <Icon type="arrow-left" /> {mediaItem.title}
        </Link>
      </div>
    );
  }
  return null;
};

const backgroundImage = (backdropPath, opacity) => ({
  background: `linear-gradient(rgba(0,0,0,${opacity}),rgba(0,0,0,${opacity})),url(${backdropPath})`,
});

const Media = props => (
  <div className="MediaItem">
    <MediaQuery query="(min-width: 768px)">
      <div className="MediaItem__backdrop" style={backgroundImage(props.backdropPath, 0.5)} />
    </MediaQuery>
    <div className="MediaHeader">
      <Switcher link={props.prev} direction="left" />
      <MediaQuery query="(min-width: 768px)">
        <div className="MediaHeader__poster">
          <img alt="" src={props.poster} />
          <AuthActions {...props} />
        </div>
      </MediaQuery>
      <div className="MediaHeader__info" style={backgroundImage(props.backdropPath, 0.8)}>
        <div className="MediaHeader__info__title">
          {props.title}
        </div>
        <Links {...props} />
        <Row gutter={32} type="flex">
          <Col xs={24} sm={24} lg={14}>
            <div className="MediaHeader__info__overview">
              <h4>Overview</h4>
              <BodyShort body={props.overview} />
            </div>
            <SelectorPopover type="season" list={props.seasons} tmdbid={props.tmdbid} seasonNum={props.seasonNum} />
            <SelectorPopover type="episode" list={props.episodes} tmdbid={props.tmdbid} seasonNum={props.seasonNum} />
            <MediaQuery query="(max-width: 768px)">
              <AuthActions {...props} />
            </MediaQuery>
          </Col>
          <Col xs={24} sm={24} lg={10}>
            <Actors actors={props.actors} />
            <Genres genres={props.genres} />
          </Col>
        </Row>
      </div>
      <Switcher link={props.next} direction="right" />
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
  isPostPage: PropTypes.bool.isRequired,
};

Media.defaultProps = {
  next: undefined,
  prev: undefined,
  episodes: undefined,
  seasons: undefined,
  seasonNum: undefined,
  episodeNum: undefined,
};

AuthActions.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  tmdbid: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  seasonNum: PropTypes.string,
  episodeNum: PropTypes.string,
};

AuthActions.defaultProps = {
  seasonNum: undefined,
  episodeNum: undefined,
};

Genres.propTypes = {
  genres: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

Actors.propTypes = {
  actors: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

Switcher.propTypes = {
  direction: PropTypes.string.isRequired,
  link: PropTypes.string,
};

Switcher.defaultProps = {
  link: undefined,
};

Links.propTypes = {
  tmdbid: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  seasonNum: PropTypes.string,
  mediaItem: PropTypes.shape().isRequired,
  isPostPage: PropTypes.bool.isRequired,
};

Links.defaultProps = {
  seasonNum: undefined,
};

export default Media;
