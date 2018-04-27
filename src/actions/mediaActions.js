import _ from 'lodash';
import { arrayToObject } from '../helpers/mediaHelpers';
import theMovieDBAPI from '../apis/theMovieDBAPI';

// fetch movie details and return object containing id, poster, backdrop, title, overview and year
export const fetchMovie = id => ({
  type: 'FETCH_MOVIE',
  payload: theMovieDBAPI.movieInfo(id)
    .then(movie => ({
      id: movie.id,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      title: movie.title,
      overview: movie.overview,
      year: movie.release_date && new Date(movie.release_date).getFullYear(),
    })),
  meta: {
    globalError: "Sorry, we couln't find that movie",
    id,
    type: 'movies',
  },
});

/*
fetch show details
return object containing id, poster, backdrop, title, overview, year and seasons
*/
export const fetchShow = id => ({
  type: 'FETCH_SHOW',
  payload: theMovieDBAPI.tvInfo(id)
    .then(show => ({
      id: show.id,
      poster_path: show.poster_path,
      backdrop_path: show.backdrop_path,
      title: show.name,
      overview: show.overview,
      year: show.first_air_date && new Date(show.first_air_date).getFullYear(),
      seasons: arrayToObject(show.seasons, 'season_number'),
    })),
  meta: {
    globalError: "Sorry, we couln't find that show",
    id,
    type: 'shows',
  },
});

// fetch season details and return object with keys for each episode number
export const fetchSeason = (id, seasonNum) => ({
  type: 'FETCH_SEASON',
  payload: theMovieDBAPI.tvSeasonInfo({ id, season_number: seasonNum })
    .then(season => arrayToObject(season.episodes, 'episode_number')),
  meta: {
    globalError: "Sorry, we couln't find that season",
    id,
    seasonNum,
  },
});

/*
fetch show details
return object containing id, poster, backdrop, title, overview, year, seasons
and episodes for specified season
*/
export const fetchSeasonAndShow = (id, seasonNum) => ({
  type: 'FETCH_SEASON_AND_SHOW',
  payload: theMovieDBAPI.tvInfo({
    id,
    append_to_response: `season/${seasonNum}`,
  }).then((show) => {
    if (!show[`season/${seasonNum}`]) {
      throw new Error('Show found, season not found');
    }
    return ({
      id: show.id,
      poster_path: show.poster_path,
      backdrop_path: show.backdrop_path,
      title: show.name,
      overview: show.overview,
      seasons: {
        ...arrayToObject(show.seasons, 'season_number'),
        [seasonNum]: {
          ...arrayToObject(show.seasons, 'season_number')[seasonNum],
          episodes: arrayToObject(show[`season/${seasonNum}`].episodes, 'episode_number'),
        },
      },
    });
  }),
  meta: {
    globalError: "Sorry, we couln't find that season",
    id,
    seasonNum,
  },
});

// fetch details for season and return episodes for specified season
export const fetchEpisode = (id, seasonNum, episodeNum) => ({
  type: 'FETCH_EPISODE',
  payload: theMovieDBAPI.tvSeasonInfo({ id, season_number: seasonNum })
    .then((season) => {
      // if episode not found in episodes object throw error
      if (!_.get(season, 'episodes').find(episode => episode.episode_number === parseInt(episodeNum, 10))) {
        throw new Error('Season found, episode not found');
      }
      return arrayToObject(season.episodes, 'episode_number');
    }),
  meta: {
    globalError: "Sorry, we couln't find that episode",
    id,
    seasonNum,
    episodeNum,
  },
});

/*
fetch show details
return object containing id, poster, backdrop, title, overview, year, seasons
and episodes for specified season
*/
export const fetchEpisodeAndShow = (id, seasonNum, episodeNum) => ({
  type: 'FETCH_EPISODE_AND_SHOW',
  payload: theMovieDBAPI.tvInfo({
    id,
    append_to_response: `season/${seasonNum}`,
  }).then((show) => {
    // if episode not found in episodes object throw error
    if (!_.get(show, `[season/${seasonNum}].episodes`).find(episode => episode.episode_number === parseInt(episodeNum, 10))) {
      throw new Error('Show found, episode not found');
    }
    return ({
      id: show.id,
      poster_path: show.poster_path,
      backdrop_path: show.backdrop_path,
      title: show.name,
      overview: show.overview,
      seasons: {
        ...arrayToObject(show.seasons, 'season_number'),
        [seasonNum]: {
          ...arrayToObject(show.seasons, 'season_number')[seasonNum],
          episodes: arrayToObject(show[`season/${seasonNum}`].episodes, 'episode_number'),
        },
      },
    });
  }),
  meta: {
    globalError: "Sorry, we couln't find that episode",
    id,
    seasonNum,
    episodeNum,
  },
});
