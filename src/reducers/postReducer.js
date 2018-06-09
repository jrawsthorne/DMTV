import _ from 'lodash';
import * as types from '../actions/types';

const initialState = {
  loaded: false,
  failed: false,
  fetching: false,
  items: {},
  itemStates: {},
  newPost: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_POSTS_FULFILLED: {
      const items = {
        ...state.items,
      };
      const itemStates = {
        ...state.itemStates,
      };

      /* set fulfilled state for each post */
      /* add data for each post to /posts/author/permlink */
      _.each(action.payload.posts, (post) => {
        items[`@${post.author}/${post.permlink}`] = post;
        itemStates[`@${post.author}/${post.permlink}`] = {
          fetching: false,
          loaded: true,
          failed: false,
        };
      });

      return {
        ...state,
        items,
        itemStates,
      };
    }
    case types.FETCH_POST_PENDING:
      /* set pending state for that post */
      return {
        ...state,
        itemStates: {
          ...state.itemStates,
          [`@${action.meta.author}/${action.meta.permlink}`]: {
            ..._.get(state.itemStates, `@${action.meta.author}/${action.meta.permlink}`),
            loaded: false,
            failed: false,
            fetching: true,
          },
        },
      };
    case types.FETCH_POST_FULFILLED:
    /* set fulfilled state for that post */
    /* add data for that post to /posts/post/author/permlink */
      return {
        ...state,
        items: {
          ...state.items,
          [`@${action.meta.author}/${action.meta.permlink}`]: action.payload,
        },
        itemStates: {
          ...state.itemStates,
          [`@${action.meta.author}/${action.meta.permlink}`]: {
            ..._.get(state.itemStates, `@${action.meta.author}/${action.meta.permlink}`),
            loaded: true,
            failed: false,
            fetching: false,
          },
        },
      };
    case types.FETCH_POST_REJECTED:
      /* set failure state for that post */
      return {
        ...state,
        itemStates: {
          ...state.itemStates,
          [`@${action.meta.author}/${action.meta.permlink}`]: {
            ..._.get(state.itemStates, `@${action.meta.author}/${action.meta.permlink}`),
            loaded: true,
            failed: true,
            fetching: false,
          },
        },
      };
    case types.NEW_POST_INFO: {
      /* merge new and old new post data */
      return {
        ...state,
        newPost: {
          ...state.newPost,
          ...action.payload,
        },
      };
    }
    default:
      return state;
  }
};

export const getPost = (state, postId) => _.get(state, `items[${postId}]`, {});
