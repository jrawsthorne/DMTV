import { arrayToObject } from '../helpers/mediaHelpers';
import theMovieDBAPI from '../apis/theMovieDBAPI';

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

export const fetchShow = id => ({
  type: 'FETCH_SHOW',
  payload: theMovieDBAPI.tvInfo(id)
    .then((show) => {
      const seasons = arrayToObject(show.seasons, 'season_number');
      return {
        id: show.id,
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        title: show.name,
        overview: show.overview,
        year: show.first_air_date && new Date(show.first_air_date).getFullYear(),
        seasons,
      };
    }),
  meta: {
    globalError: "Sorry, we couln't find that show",
    id,
    type: 'shows',
  },
});

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

export const fetchSeasonAndShow = (id, seasonNum) => ({
  type: 'FETCH_SHOW_AND_SEASON',
  payload: theMovieDBAPI.tvInfo({
    id,
    append_to_response: `season/${seasonNum}`,
  }).then((show) => {
    const seasons = arrayToObject(show.seasons, 'season_number');
    seasons[seasonNum].episodes = arrayToObject(show[`season/${seasonNum}`].episodes, 'episode_number');
    return ({
      id: show.id,
      poster_path: show.poster_path,
      backdrop_path: show.backdrop_path,
      title: show.name,
      overview: show.overview,
      seasons,
    });
  }),
  meta: {
    globalError: "Sorry, we couln't find that season",
    id,
    seasonNum,
  },
});
