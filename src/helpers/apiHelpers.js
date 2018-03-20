import steem from 'steem';
import MovieDb from 'moviedb-promise';

const moviedb = new MovieDb('2e0e3a384f4b2319fbe441f5da30407f');

export function getDiscussionsFromAPI(query) {
  return new Promise((resolve, reject) => {
    steem.api.getDiscussionsByTrending(query, (err, result) => {
      if (err !== null) return reject(Error(err));
      return resolve(result);
    });
  });
}

export function getMediaItem(reviewType, query) {
  return new Promise((resolve, reject) => {
    switch (reviewType) {
      case 'movie':
        return resolve(moviedb.movieInfo(query.id));
      case 'show':
        return resolve(moviedb.tvInfo(query.id));
      case 'episode':
        return resolve(moviedb.tvEpisodeInfo({
          id: query.id,
          episode_number: query.episode_number,
          season_number: query.season_number,
        }));
      default:
        return reject(Error('There is no API endpoint defined for this review type'));
    }
  });
}
