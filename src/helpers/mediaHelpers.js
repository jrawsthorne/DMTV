import _ from 'lodash';
import noImageFound from '../images/no-image-found.jpg';

const movieDetails = movie => ({
  title: (movie.title && movie.year && `${movie.title} (${movie.year})`) || movie.title || 'No title',
  overview: movie.overview || 'No overview',
  backdropPath: (movie.backdrop_path && `https://image.tmdb.org/t/p/original${movie.backdrop_path}`) || '',
  posterPath: (movie.poster_path && `https://image.tmdb.org/t/p/original${movie.poster_path}`) || noImageFound,
});

const showDetails = show => ({
  title: (show.title && show.year && `${show.title} (${show.year})`) || show.title || 'No title',
  overview: show.overview || 'No overview',
  backdropPath: (show.backdrop_path && `https://image.tmdb.org/t/p/original${show.backdrop_path}`) || '',
  posterPath: (show.poster_path && `https://image.tmdb.org/t/p/original${show.poster_path}`) || noImageFound,
});

export const seasonDetails = (show, seasonNum) => ({
  title: (seasonNum !== '0' && _.get(show, `seasons[${seasonNum}].air_date`) && `Season ${seasonNum} (${new Date(_.get(show, `seasons[${seasonNum}].air_date`)).getFullYear()})`) || `Season ${seasonNum}`,
  overview: _.get(show, `seasons[${seasonNum}].overview`) || 'No overview',
  backdropPath: (show.backdrop_path && `https://image.tmdb.org/t/p/original${show.backdrop_path}`) || '',
  posterPath: (!_.isEmpty(_.get(show, `seasons[${seasonNum}].poster_path`)) && `https://image.tmdb.org/t/p/original${show.seasons[seasonNum].poster_path}`) || showDetails(show).posterPath,
});

export const EpisodeTitle = props => `${props.name} S${props.seasonNum} E${props.episodeNum}`;

export const episodeDetails = (show, seasonNum, episodeNum) => ({
  title: `${_.get(show, `seasons[${seasonNum}].episodes[${episodeNum}].name`)} S${seasonNum} E${episodeNum}`,
  overview: `${_.get(show, `seasons[${seasonNum}].episodes[${episodeNum}].overview`)}` || 'No overview',
  posterPath: (show.poster_path && `https://image.tmdb.org/t/p/original${show.poster_path}`) || noImageFound,
  backdropPath: (_.get(show, `seasons[${seasonNum}].episodes[${episodeNum}].still_path`) && `https://image.tmdb.org/t/p/original${_.get(show, `seasons[${seasonNum}].episodes[${episodeNum}].still_path`)}`) || (show.backdrop_path && `https://image.tmdb.org/t/p/original${show.backdrop_path}`) || '',
});

export const getMediaItemDetails = (mediaItem, type, seasonNum = null, episodeNum = null) => {
  switch (type) {
    case 'movie':
      return movieDetails(mediaItem);
    case 'show':
      return showDetails(mediaItem);
    case 'season':
      return seasonDetails(mediaItem, seasonNum);
    case 'episode':
      return episodeDetails(mediaItem, seasonNum, episodeNum);
    default:
      return {};
  }
};

export const getMediaType = (post) => {
  if (post.mediaType === 'movie') return 'movie';
  if (post.seasonNum) {
    if (post.episodeNum) {
      return 'episode';
    }
    return 'season';
  }
  return 'show';
};

export const getNextPrev = (mediaItem, seasonNum, episodeNum) => {
  if (episodeNum) {
    return {
      prev: _.get(mediaItem, `seasons[${seasonNum}].episodes[${episodeNum - 1}]`) && `/show/${mediaItem.id}/season/${seasonNum}/episode/${episodeNum - 1}`,
      next: _.get(mediaItem, `seasons[${seasonNum}].episodes[${parseInt(episodeNum, 10) + 1}]`) && `/show/${mediaItem.id}/season/${seasonNum}/episode/${parseInt(episodeNum, 10) + 1}`,
    };
  }
  return {
    prev: _.get(mediaItem, `seasons[${seasonNum - 1}]`) && `/show/${mediaItem.id}/season/${seasonNum - 1}`,
    next: _.get(mediaItem, `seasons[${parseInt(seasonNum, 10) + 1}]`) && `/show/${mediaItem.id}/season/${parseInt(seasonNum, 10) + 1}`,
  };
};

export const arrayToObject = (arr, keyField) =>
  Object.assign({}, ...arr.map(item => ({ [item[keyField]]: item })));

export default getMediaItemDetails;
