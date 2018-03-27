import 'babel-polyfill';
import _ from 'lodash';
import { FETCH_POSTS, REMOVE_POST, FETCH_POSTS_ERROR, FETCH_MEDIA_END, FETCH_MEDIA_ITEM, FETCH_MEDIA_ITEM_ERROR, FETCH_MEDIA_ITEM_START } from './types';
import { getDiscussionsFromAPI, getReviewTypeFromPost, getSeasonNumberFromPost, getEpisodeNumberFromPost, getMediaItem, getTmdbIdFromPost } from '../helpers/apiHelpers';

const fetchMediaItemsFromPosts = posts => dispatch => Promise.all(posts.map(post =>
  getMediaItem(getReviewTypeFromPost(post), {
    id: getTmdbIdFromPost(post),
    season_number: getSeasonNumberFromPost(post),
    episode_number: getEpisodeNumberFromPost(post),
  })
    .then((mediaItem) => {
      const item = mediaItem;
      item.mediaType = getReviewTypeFromPost(post);
      dispatch({
        type: FETCH_MEDIA_ITEM,
        payload: item,
      });
    })
    .catch((err) => {
      dispatch({
        type: FETCH_MEDIA_ITEM_ERROR,
        payload: err,
      });
      dispatch({
        type: REMOVE_POST,
        payload: post,
      });
    })));

export const fetchPosts = ({ sortBy = 'trending', category, limit = 10 }) => (dispatch) => {
  getDiscussionsFromAPI(sortBy, { category, limit })
    .then((posts) => {
      dispatch({
        type: FETCH_POSTS,
        payload: posts,
      });
      dispatch(fetchMediaItemsFromPosts(posts)).then(() => dispatch({
        type: FETCH_MEDIA_END,
      }));
    })
    .catch(err => dispatch({
      type: FETCH_POSTS_ERROR,
      payload: err,
    }));
};

export const fetchMediaItem = (id, reviewType, seasonNum, episodeNum) => (dispatch) => {
  getMediaItem(reviewType, { id, episode_number: episodeNum, season_number: seasonNum })
    .then((mediaItem) => {
      const item = mediaItem;
      item.mediaType = reviewType;
      if (reviewType === 'episode' && !_.isEmpty(item[`season/${seasonNum}/episode/${episodeNum}`])) {
        item.episodeNum = episodeNum;
        item.seasonNum = seasonNum;
        dispatch({
          type: FETCH_MEDIA_ITEM,
          payload: item,
        });
      } else if (reviewType !== 'episode') {
        dispatch({
          type: FETCH_MEDIA_ITEM,
          payload: item,
        });
      } else {
        dispatch({
          type: FETCH_MEDIA_ITEM_ERROR,
          payload: { message: 'Season or episode not found' },
        });
      }
    })
    .catch(err => dispatch({
      type: FETCH_MEDIA_ITEM_ERROR,
      payload: err,
    }));
};

export const fetchMediaItemStart = () => (dispatch) => {
  dispatch({
    type: FETCH_MEDIA_ITEM_START,
  });
};

export default fetchPosts;
