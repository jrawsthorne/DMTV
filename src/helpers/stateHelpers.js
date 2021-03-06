import _ from 'lodash';

export const getFeedFromState = (sortBy, category = 'all', state) => {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'created':
    case 'active':
    case 'trending':
    case 'blog':
    case 'subscriptions': {
      let query = sortBy;
      if (category.type) {
        const {
          tmdbid, type, seasonNum, episodeNum,
        } = category;
        query += `.${type}.${tmdbid}`;
        if (seasonNum) {
          query += `.seasons.${seasonNum}`;
          if (episodeNum) {
            query += `.episodes.${episodeNum}`;
          }
        }
      } else if (category.author) {
        query += `.${category.author}`;
      } else {
        query += `.${category}`;
      }
      return _.get(state, `${query}.list`, []);
    }
    default:
      return [];
  }
};

export const getFeedStatusFromState = (sortBy, category = 'all', feedState) => {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'created':
    case 'active':
    case 'trending':
    case 'blog':
    case 'subscriptions': {
      let query = sortBy;
      if (category.type) {
        const {
          tmdbid, type, seasonNum, episodeNum,
        } = category;
        query += `.${type}.${tmdbid}`;
        if (seasonNum) {
          query += `.seasons.${seasonNum}`;
          if (episodeNum) {
            query += `.episodes.${episodeNum}`;
          }
        }
      } else if (category.author) {
        query += `.${category.author}`;
      } else {
        query += `.${category}`;
      }
      return {
        fetching: _.get(feedState, `${query}.fetching`, false),
        fetchingMore: _.get(feedState, `${query}.fetchingMore`, false),
        loaded: _.get(feedState, `${query}.loaded`, false),
        failed: _.get(feedState, `${query}.failed`, false),
        hasMore: _.get(feedState, `${query}.hasMore`, false),
      };
    }
    default:
      return {
        fetching: false,
        loaded: false,
        failed: false,
        hasMore: false,
      };
  }
};

export const getMediaStatusFromState = ({
  id, mediaType, seasonNum, episodeNum,
}, state) => {
  let type;
  if (mediaType === 'movie') {
    type = 'movies';
  } else if (mediaType === 'show' || mediaType === 'episode' || mediaType === 'season') {
    type = 'shows';
  }
  let query = `${type}.${id}`;
  if (seasonNum) query += `.seasons.${seasonNum}`;
  const fetching = _.get(state, `${query}.fetching`, false);
  if (episodeNum) query += `.episodes.${episodeNum}`;
  return {
    fetching,
    loaded: _.get(state, `${query}.loaded`, false),
    failed: _.get(state, `${query}.failed`, false),
  };
};
