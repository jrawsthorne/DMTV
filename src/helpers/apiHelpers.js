import theMovieDBAPI from '../apis/theMovieDBAPI';
import steemAPI from '../apis/steemAPI';

export const getDiscussionsFromAPI = query =>
  new Promise((resolve, reject) => {
    steemAPI.getDiscussionsByTrending(query, (err, result) => {
      if (err !== null) return reject(Error(err));
      return resolve(result);
    });
  });

export const getMediaItem = (reviewType, query) =>
  new Promise((resolve, reject) => {
    switch (reviewType) {
      case 'movie':
        return resolve(theMovieDBAPI.movieInfo(query.id));
      case 'show':
        return resolve(theMovieDBAPI.tvInfo(query.id));
      case 'episode':
        return resolve(theMovieDBAPI.tvEpisodeInfo({
          id: query.id,
          episode_number: query.episode_number,
          season_number: query.season_number,
        }));
      default:
        return reject(Error('There is no API endpoint defined for this review type'));
    }
  });

export const getTmdbIdFromPost = post => JSON.parse(post.json_metadata).tmdb_id;
export const getReviewTypeFromPost = post => JSON.parse(post.json_metadata).review_type;
export const getEpisodeNumberFromPost = post => JSON.parse(post.json_metadata).episode_num;
export const getSeasonNumberFromPost = post => JSON.parse(post.json_metadata).season_num;

export function getMediaItems(posts) {
  return Promise.all(posts.map((post) => {
    const itemPromise = getMediaItem(getReviewTypeFromPost(post), {
      id: getTmdbIdFromPost(post),
      season_number: getSeasonNumberFromPost(post),
      episode_number: getEpisodeNumberFromPost(post),
    });
    return itemPromise.then((mediaItem) => {
      const item = mediaItem;
      item.postId = post.id;
      return item;
    });
  }));
}
