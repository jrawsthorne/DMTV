import _ from 'lodash';
import axios from 'axios';
import { arrayToObject } from '../helpers/mediaHelpers';
import theMovieDBAPI from '../apis/theMovieDBAPI';
import {
  FETCH_MOVIE,
  FETCH_SHOW,
  FETCH_SEASON,
  FETCH_EPISODE,
  USER_RATE_CHANGE,
  SUBSCRIBE_CHANGE,
  FETCH_ACTOR,
} from './types';

// fetch movie details and return object containing id, poster, backdrop, title, overview and year
export const fetchMovie = id => ({
  type: FETCH_MOVIE,
  payload: theMovieDBAPI.movieInfo({ id, append_to_response: 'credits,similar' })
    .then(movie => ({
      id: movie.id,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      title: movie.title,
      overview: movie.overview,
      year: movie.release_date && new Date(movie.release_date).getFullYear(),
      actors: movie.credits.cast.slice(0, 3),
      genres: movie.genres.slice(0, 3),
      similar: _.orderBy(movie.similar.results, 'popularity', 'desc').slice(0, 10),
    })),
  meta: {
    globalError: "Sorry, we couln't find that movie",
    id,
    type: 'movies',
  },
});

export const fetchActor = id => ({
  type: FETCH_ACTOR,
  payload: theMovieDBAPI.personInfo({ id, append_to_response: 'combined_credits' }).then(person => ({
    ...person,
    combined_credits: _.orderBy(_.uniqBy(person.combined_credits.cast, 'id'), 'popularity', 'desc').slice(0, 10),
  })),
  meta: {
    globalError: "Sorry, we couln't find that preson",
    id,
  },
});

/*
fetch show details
return object containing id, poster, backdrop, title, overview, year and seasons
*/
export const fetchShow = id => ({
  type: FETCH_SHOW,
  payload: theMovieDBAPI.tvInfo({ id, append_to_response: 'credits,similar' })
    .then(show => ({
      id: show.id,
      poster_path: show.poster_path,
      backdrop_path: show.backdrop_path,
      title: show.name,
      overview: show.overview,
      year: show.first_air_date && new Date(show.first_air_date).getFullYear(),
      seasons: arrayToObject(show.seasons, 'season_number'),
      actors: show.credits.cast.slice(0, 3),
      genres: show.genres.slice(0, 3),
      similar: _.orderBy(show.similar.results, 'popularity', 'desc').slice(0, 10),
    })),
  meta: {
    globalError: "Sorry, we couln't find that show",
    id,
    type: 'shows',
  },
});

/*
fetch show details
return object containing id, poster, backdrop, title, overview, year, seasons
and episodes for specified season
*/
export const fetchSeason = (id, seasonNum) => ({
  type: FETCH_SEASON,
  payload: theMovieDBAPI.tvInfo({
    id,
    append_to_response: `season/${seasonNum},credits,similar`,
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
      actors: show.credits.cast.slice(0, 3),
      genres: show.genres.slice(0, 3),
      similar: _.orderBy(show.similar.results, 'popularity', 'desc').slice(0, 10),
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

/*
fetch show details
return object containing id, poster, backdrop, title, overview, year, seasons
and episodes for specified season
*/
export const fetchEpisode = (id, seasonNum, episodeNum) => ({
  type: FETCH_EPISODE,
  payload: theMovieDBAPI.tvInfo({
    id,
    append_to_response: `season/${seasonNum},credits,similar`,
  }).then((show) => {
    // if episode not found in episodes object throw error
    if (!_.get(show, `[season/${seasonNum}].episodes`) || !_.get(show, `[season/${seasonNum}].episodes`).find(episode => episode.episode_number === parseInt(episodeNum, 10))) {
      throw new Error('Show found, episode not found');
    }
    return ({
      id: show.id,
      poster_path: show.poster_path,
      backdrop_path: show.backdrop_path,
      title: show.name,
      overview: show.overview,
      actors: show.credits.cast.slice(0, 3),
      genres: show.genres.slice(0, 3),
      similar: _.orderBy(show.similar.results, 'popularity', 'desc').slice(0, 10),
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

export const userRateChange = (
  mediaType,
  tmdbid,
  seasonNum = undefined,
  episodeNum = undefined,
  value,
) => ({
  type: USER_RATE_CHANGE,
  payload: axios.post(`${process.env.API_URL}/ratings/add`, {
    mediaType,
    tmdbid,
    seasonNum: seasonNum || undefined,
    episodeNum: episodeNum || undefined,
    value,
  }).then(res => res.data),
  meta: {
    mediaType,
    tmdbid,
    seasonNum: seasonNum || undefined,
    episodeNum: episodeNum || undefined,
    value,
    globalError: 'Sorry, there was an error adding the rating',
  },
});


export const subscribeChange = (type, tmdbid, subscribed) => ({
  type: SUBSCRIBE_CHANGE,
  payload: axios.post(`${process.env.API_URL}/subscriptions/change`, {
    type,
    tmdbid,
    subscribed,
  }).then(res => res.data),
  meta: {
    globalError: 'Sorry, there was an error changing your subscription',
    type,
    tmdbid,
    subscribed,
  },
});
