import _ from 'lodash';
import noImageFound from '../images/no-image-found.jpg';

const movieDetails = movie => ({
  title: (movie.title && movie.year && `${movie.title} (${movie.year})`) || movie.title || 'No title',
  overview: movie.overview || 'No overview',
  backdropPath: (movie.backdrop_path && `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`) || '',
  posterPath: (movie.poster_path && `https://image.tmdb.org/t/p/w200${movie.poster_path}`) || noImageFound,
});

const showDetails = show => ({
  title: (show.title && show.year && `${show.title} (${show.year})`) || show.title || 'No title',
  overview: show.overview || 'No overview',
  backdropPath: (show.backdrop_path && `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`) || '',
  posterPath: (show.poster_path && `https://image.tmdb.org/t/p/w200${show.poster_path}`) || noImageFound,
});

export const getSeasonDetails = (show, seasonNum) => ({
  title: (seasonNum !== '0' && _.get(show, `seasons[${seasonNum}].air_date`) && `Season ${seasonNum} (${new Date(_.get(show, `seasons[${seasonNum}].air_date`)).getFullYear()})`) || `Season ${seasonNum}`,
  overview: _.get(show, `seasons[${seasonNum}].overview`) || 'No overview',
  backdropPath: (show.backdrop_path && `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`) || '',
  posterPath: (!_.isEmpty(_.get(show, `seasons[${seasonNum}].poster_path`)) && `https://image.tmdb.org/t/p/w200${show.seasons[seasonNum].poster_path}`) || showDetails(show).posterPath,
});

export const EpisodeTitle = props => `${props.name} S${props.seasonNum} E${props.episodeNum}`;

export const getEpisodeDetails = (show, seasonNum, episodeNum) => ({
  title: `${_.get(show, `seasons[${seasonNum}].episodes[${episodeNum}].name`)} S${seasonNum} E${episodeNum}`,
  overview: `${_.get(show, `seasons[${seasonNum}].episodes[${episodeNum}].overview`)}` || 'No overview',
  backdropPath: (show.backdrop_path && `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`) || '',
  posterPath: (_.get(show, `seasons[${seasonNum}].episodes[${episodeNum}].still_path`) && `https://image.tmdb.org/t/p/w300${_.get(show, `seasons[${seasonNum}].episodes[${episodeNum}].still_path`)}`) || (show.backdrop_path && `https://image.tmdb.org/t/p/w300${show.backdrop_path}`) || noImageFound,
});

export const getMediaItemDetails = (mediaItem, type) => {
  switch (type) {
    case 'movie':
      return movieDetails(mediaItem);
    case 'show':
      return showDetails(mediaItem);
    default:
      return {};
  }
};

export const arrayToObject = (arr, keyField) =>
  Object.assign({}, ...arr.map(item => ({ [item[keyField]]: item })));

export default getMediaItemDetails;
