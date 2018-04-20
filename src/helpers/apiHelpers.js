import theMovieDBAPI from '../apis/theMovieDBAPI';

export const getMediaItem = (reviewType, query) =>
  new Promise((resolve, reject) => {
    switch (reviewType) {
      case 'movie':
        return resolve(theMovieDBAPI.movieInfo(query.id));
      case 'show':
        return resolve(theMovieDBAPI.tvInfo(query.id));
      case 'episode': {
        if (query.season_number && query.episode_number) {
          return new Promise(() => theMovieDBAPI.tvInfo({
            id: query.id,
            append_to_response: `season/${query.season_number}/episode/${query.episode_number}`,
          }).then((response) => {
            if (response[`season/${query.season_number}/episode/${query.episode_number}`]) {
              return resolve(response);
            }
            return reject(Error('Episode or season not found'));
          }));
        }
        return reject(Error('No episode or season number defined'));
      }
      case 'season': {
        if (query.seasonNum) {
          return resolve(theMovieDBAPI.tvSeasonInfo({
            id: query.id,
            season_number: query.seasonNum,
          }));
        }
        return reject(Error('No season number defined'));
      }
      case 'seasonshow': {
        return new Promise(() => theMovieDBAPI.tvInfo({
          id: query.id,
          append_to_response: `season/${query.seasonNum}`,
        }).then((response) => {
          if (response[`season/${query.seasonNum}`]) {
            return resolve(response);
          }
          return reject(Error('Show or season not found'));
        }));
      }
      case 'search': {
        if (query.q) {
          return resolve(theMovieDBAPI.searchMulti({ query: query.q }));
        }
        return resolve({ results: [] });
      }

      default:
        return reject(Error('There is no API endpoint defined for this review type'));
    }
  });

export default getMediaItem;
