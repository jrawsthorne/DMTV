/* eslint-disable
jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover } from 'antd';
import { Link } from 'react-router-dom';
import './Media.less';

import SubscribeButton from './SubscribeButton';
import StarRating from './StarRating';

const Media = (props) => {
  const { handleEpisodeClick, handleSeasonClick } = props;
  return (
    <div className="MediaItem">
      <div
        className="MediaItem__background"
        style={{ background: `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(${props.backdropPath})` }}
      >
        <div className="MediaHeader" style={{ position: 'relative' }}>
          {props.prev &&
          <Link className="prev-next" to={props.prev} >
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
            <div className="MediaHeader__info__overview"><p>{props.overview}</p></div>
            {props.seasons &&
              <div className="MediaHeader__info__selectors">
                {props.seasons &&
                <Popover
                  onVisibleChange={props.handleSeasonVisibleChange}
                  visible={props.showSeasons}
                  placement="bottom"
                  content={Object.values(props.seasons).map(season =>
                (
                  <p
                    onClick={() => handleSeasonClick(season.season_number)}
                    className="Filter__option"
                    key={`season-${season.season_number}`}
                  >{season.name}
                  </p>
                ))}
                  trigger="click"
                >
                  <span className="Filter__dropdown" style={{ marginLeft: 0 }}>
                Seasons <Icon type="down" style={{ fontSize: 15 }} />
                  </span>
                </Popover>
            }
                {props.episodes &&
                <Popover
                  onVisibleChange={props.handleEpisodeVisibleChange}
                  visible={props.showEpisodes}
                  placement="bottom"
                  content={Object.values(props.episodes).map(episode =>
                (
                  <p
                    onClick={() => handleEpisodeClick(episode.episode_number)}
                    className="Filter__option"
                    key={`season-${episode.episode_number}`}
                  >{episode.name}
                  </p>
                ))}
                  trigger="click"
                >
                  <span className="Filter__dropdown">
                Episodes <Icon type="down" style={{ fontSize: 15 }} />
                  </span>
                </Popover>
            }
              </div>}
            {props.isAuthenticated && (
              <React.Fragment>
                <div className="MediaHeader__info__rating">
                  <p>Your rating</p>
                  <StarRating
                    tmdbid={props.tmdbid}
                    mediaType={props.mediaType}
                    seasonNum={props.seasonNum}
                    episodeNum={props.episodeNum}
                  />
                </div>
                <div className="MediaHeader__info__subscribe">
                  <SubscribeButton
                    tmdbid={props.tmdbid}
                    mediaType={props.mediaType}
                  />
                </div>
              </React.Fragment>
            )}
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
    </div>
  );
};

Media.propTypes = {
  title: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  backdropPath: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  next: PropTypes.string,
  prev: PropTypes.string,
  episodes: PropTypes.shape(),
  seasons: PropTypes.shape(),
  handleEpisodeClick: PropTypes.func.isRequired,
  handleSeasonClick: PropTypes.func.isRequired,
  showSeasons: PropTypes.bool.isRequired,
  showEpisodes: PropTypes.bool.isRequired,
  handleSeasonVisibleChange: PropTypes.func.isRequired,
  handleEpisodeVisibleChange: PropTypes.func.isRequired,
  tmdbid: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  seasonNum: PropTypes.string,
  episodeNum: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
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
