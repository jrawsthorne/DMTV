import _ from 'lodash';
import * as types from '../actions/types';

const initialState = {
  loaded: false,
  failed: false,
  fetching: false,
  items: {},
  itemStates: {},
  newPost: {},
  pendingLikes: [],
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
    case types.CREATE_POST_PENDING:
      return {
        ...state,
        newPost: {
          ...state.newPost,
          broadcasting: true,
          failed: false,
          broadcasted: false,
        },
      };
    case types.CREATE_POST_REJECTED:
      return {
        ...state,
        newPost: {
          ...state.newPost,
          broadcasting: false,
          failed: true,
          broadcasted: false,
        },
      };
    case types.CREATE_POST_FULFILLED:
      return {
        ...state,
        newPost: {
          broadcasting: false,
          failed: false,
          broadcasted: true,
        },
      };
    case types.LIKE_POST_PENDING:
      return {
        ...state,
        pendingLikes: [
          ...state.pendingLikes,
          {
            postId: action.meta.postId,
            weight: action.meta.weight,
          },
        ],
      };
    case types.LIKE_POST_FULFILLED:
    case types.LIKE_POST_REJECTED: {
      const { weight, postId } = action.meta;
      const pendingLikes = _.filter(
        state.pendingLikes,
        (like => like.postId !== postId && like.weight !== weight),
      );
      return {
        ...state,
        pendingLikes,
      };
    }
    default:
      return state;
  }
};

export const getPost = (state, postId) => _.get(state, postId, {});
export const getPostState = (state, postId) => ({
  fetching: _.get(state, `${postId}.fetching`, false),
  loaded: _.get(state, `${postId}.loaded`, false),
  failed: _.get(state, `${postId}.failed`, false),
});
export const getPosts = state => state;
