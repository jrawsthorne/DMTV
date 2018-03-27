import React from 'react';
import PropTypes from 'prop-types';
// import Dotdotdot from 'react-dotdotdot';
import { Link } from 'react-router-dom';
import './Media.less';
import noImageFound from '../../images/no-image-found.jpg';
import PostsContainer from '../../containers/PostsContainer';

// const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


class Media extends React.Component {
  static propTypes = {
    mediaItem: PropTypes.shape().isRequired,
  };
  state = {
    posterLoaded: false,
  }
  handlePosterLoaded = () => {
    this.setState({
      posterLoaded: true,
    });
  }
  render() {
    const {
      mediaItem,
    } = this.props;
    const { posterLoaded } = this.state;
    const episodeInfo = mediaItem.mediaType === 'episode' && mediaItem && mediaItem[`season/${mediaItem.seasonNum}/episode/${mediaItem.episodeNum}`];
    const backdropPath = mediaItem.backdrop_path && `https://image.tmdb.org/t/p/original${mediaItem.backdrop_path}`;
    const title = (episodeInfo.name && episodeInfo.season_number && episodeInfo.episode_number && (`${episodeInfo.name} S${episodeInfo.season_number} E${episodeInfo.episode_number}`)) || (mediaItem.title && mediaItem.title) || (mediaItem.name && mediaItem.name);
    const overview = (episodeInfo.overview && episodeInfo.overview) || (!episodeInfo && mediaItem.overview && mediaItem.overview) || "Sorry, we don't have an overview for this item";
    const poster = (mediaItem.poster_path && `https://image.tmdb.org/t/p/w200${mediaItem.poster_path}`) || noImageFound
    || (mediaItem.overview && mediaItem.overview);
    const category = `tmdbid-${mediaItem.id}`;
    return (
      <div id={mediaItem.id} className="MediaItem">
        <div
          className="MediaItem__background"
          style={{ background: `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(${backdropPath})` }}
        >
          <div className="MediaHeader">
            <div className="MediaHeader__poster"><img onLoad={this.handlePosterLoaded} alt="poster" src={poster} /></div>
            {posterLoaded &&
            <div className="MediaHeader__info">
              <div className="MediaHeader__info__title">
                {title}
              </div>
              <div className="MediaHeader__info__overview">{overview}</div>
              {episodeInfo.season_number && episodeInfo.episode_number && (
                <div className="MediaHeader__link">
                  <Link to={`/show/${mediaItem.id}`}>Go to show</Link>
                </div>
              )}
            </div>
          }
          </div>
        </div>
        <div style={{ padding: 24 }}>
          <PostsContainer category={category} />
        </div>
      </div>
    );
  }
}

export default Media;
