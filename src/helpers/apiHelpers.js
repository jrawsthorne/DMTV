import theMovieDBAPI from '../apis/theMovieDBAPI';
import steemAPI from '../apis/steemAPI';

export const getDiscussionsByTrending = query =>
  new Promise((resolve, reject) => {
    steemAPI.getDiscussionsByTrending(query, (err, result) => {
      const posts = [];
      result.forEach((post) => {
        if (JSON.parse(post.json_metadata).tags.find(tag => tag.includes('-review'))) {
          posts.push(post);
        }
      });
      if (err !== null) return reject(Error(err));
      return resolve(posts);
    });
  });

export const getDiscussionsFromAPI = (sortBy, query) =>
  new Promise((resolve, reject) => {
    switch (sortBy) {
      case 'trending':
        return new Promise(() => {
          steemAPI.getDiscussionsByTrending(query, (err, result) => {
            const posts = [];
            result.forEach((post) => {
              if (JSON.parse(post.json_metadata).tags.find(tag => tag.includes('-review'))) {
                posts.push(post);
              }
            });
            if (err !== null) return reject(Error(err));
            return resolve(posts);
          });
        });
      case 'created':
        return new Promise(() => {
          steemAPI.getDiscussionsByCreated(query, (err, result) => {
            const posts = [];
            result.forEach((post) => {
              if (JSON.parse(post.json_metadata).tags.find(tag => tag.includes('-review'))) {
                posts.push(post);
              }
            });
            if (err !== null) return reject(Error(err));
            return resolve(posts);
          });
        });
      case 'hot':
        return new Promise(() => {
          steemAPI.getDiscussionsByHot(query, (err, result) => {
            const posts = [];
            result.forEach((post) => {
              if (JSON.parse(post.json_metadata).tags.find(tag => tag.includes('-review'))) {
                posts.push(post);
              }
            });
            if (err !== null) return reject(Error(err));
            return resolve(posts);
          });
        });
      case 'promoted':
        return new Promise(() => {
          steemAPI.getDiscussionsByPromoted(query, (err, result) => {
            const posts = [];
            result.forEach((post) => {
              if (JSON.parse(post.json_metadata).tags.find(tag => tag.includes('-review'))) {
                posts.push(post);
              }
            });
            if (err !== null) return reject(Error(err));
            return resolve(posts);
          });
        });
      default:
        return reject(Error('There is no API endpoint defined for this sorting'));
    }
  });

export const getDiscussionsByCreated = query =>
  new Promise((resolve, reject) => {
    steemAPI.getDiscussionsByCreated(query, (err, result) => {
      const posts = [];
      result.forEach((post) => {
        if (JSON.parse(post.json_metadata).tags.find(tag => tag.includes('-review'))) {
          posts.push(post);
        }
      });
      if (err !== null) return reject(Error(err));
      return resolve(posts);
    });
  });

export const getMediaItem = (reviewType, query) =>
  new Promise((resolve, reject) => {
    switch (reviewType) {
      case 'movie':
        return new Promise(() =>
          theMovieDBAPI.movieInfo(query.id)
            .then(movie => resolve(movie))
            .catch(err => reject(err)));
      case 'show':
        return resolve(theMovieDBAPI.tvInfo(query.id));
      case 'episode':
        return resolve(theMovieDBAPI.tvInfo({
          id: query.id,
          append_to_response: `season/${query.season_number}/episode/${query.episode_number}`,
        }));
      default:
        return reject(Error('There is no API endpoint defined for this review type'));
    }
  });

export const getReviewTypeFromPost = post => JSON.parse(post.json_metadata).tags.find(tag => tag.includes('-review')).replace('-review', '');
export const getTmdbIdFromPost = post => JSON.parse(post.json_metadata).tags.find(tag => tag.includes('tmdbid-')).replace('tmdbid-', '');
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
