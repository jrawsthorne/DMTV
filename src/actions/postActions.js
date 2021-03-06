import axios from 'axios';
import _ from 'lodash';
import { push } from 'connected-react-router';
import { FETCH_POSTS, FETCH_POST, NEW_POST_INFO, CREATE_POST, LIKE_POST, FETCH_REPLY } from './types';
import { createPermlink } from '../helpers/steemitHelpers';
import { getAuthHeaders } from './authActions';
import { getFeed, getPosts } from '../reducers';
import { getFeedFromState } from '../helpers/stateHelpers';

// return only data we need
const getPostData = (steemPost, post) => ({
  ...steemPost,
  url: `@${steemPost.author}/${steemPost.permlink}`,
  postType: post.postType,
  media: {
    title: post.title,
    mediaType: post.mediaType,
    backdropPath: post.backdropPath || undefined,
    posterPath: post.posterPath || undefined,
    episodePath: post.episodePath || undefined,
    seasonPath: post.seasonPath || undefined,
    seasonNum: post.seasonNum || undefined,
    episodeNum: post.episodeNum || undefined,
    type: post.type,
    tmdbid: post.tmdbid,
  },
  /* WHEN LIVE WILL USE STEEM CREATED AT */
  createdAt: post.createdAt,
});

// fetch post from db and return steem and db info
export const fetchPost = (author, permlink, afterLike = false) => (
  dispatch,
  getState,
  { steemAPI },
) => dispatch({
  type: FETCH_POST,
  payload: axios.get(`${process.env.API_URL}/posts/@${author}/${permlink}`)
    .then(res => res.data)
    .then(post =>
      steemAPI.getContentAsync(post.author, post.permlink)
        .then(steemPost => getPostData(steemPost, post)))
    .then(steemPost => steemPost.id !== 0 && steemPost), /* only return post if it exists */
  meta: {
    author,
    permlink,
    afterLike,
    globalError: 'Sorry, there was an error fetching the post',
  },
});

export const fetchReply = (author, permlink, afterLike = false) => (
  dispatch,
  getState,
  { steemAPI },
) => dispatch({
  type: FETCH_REPLY,
  payload: steemAPI.getContentAsync(author, permlink),
  meta: {
    author,
    permlink,
    afterLike,
    globalError: 'Sorry, there was an error fetching the reply',
  },
});

// add sortby options

export const fetchPosts = ({ sortBy = 'created', category, limit = 20 }, reload) => (
  dispatch,
  getState,
  { steemAPI },
) => {
  const state = getState();
  const posts = getPosts(state);
  let query = {};
  if (category === 'movie' || category === 'show' || category === 'episode') {
    query.mediaType = category;
  } else if (_.isObject(category)) {
    query = { ...category };
  }
  dispatch({
    type: FETCH_POSTS,
    payload: axios.get(`${process.env.API_URL}/posts`, {
      params: {
        sortBy,
        ...query,
        limit,
      },
    })
      .then(res =>
        Promise.all(res.data.results.map(post => /* loop through each post from the db */
          (!_.get(posts, `@${post.author}/${post.permlink}`) ?
            /* get the post from steem if not stored */
            steemAPI.getContentAsync(post.author, post.permlink)
              .then(steemPost => getPostData(steemPost, post))
              .catch(() => Promise.resolve(null)) /* carry on if error finding post */
            : _.get(posts, `@${post.author}/${post.permlink}`)
          )))
          .then(p => ({
            count: res.data.count,
            posts: p.filter(post => post !== null), /* eliminate posts that errored */
          }))),
    meta: {
      sortBy,
      category: category || 'all',
      limit,
      reload,
    },
  });
};

export const fetchMorePosts = ({ sortBy = 'created', category, limit = 20 }) => (
  dispatch,
  getState,
  { steemAPI },
) => {
  const state = getState();
  const feed = getFeed(state);
  const posts = getPosts(state);
  const feedContent = getFeedFromState(sortBy, category, feed);
  const lastPost = posts[feedContent[feedContent.length - 1]];
  const { author: startAuthor, permlink: startPermlink, createdAt: createdBefore } = lastPost;
  let query = {};
  if (category === 'movie' || category === 'show' || category === 'episode') {
    query.mediaType = category;
  } else if (_.isObject(category)) {
    query = { ...category };
  }
  dispatch({
    type: FETCH_POSTS,
    payload: axios.get(`${process.env.API_URL}/posts`, {
      params: {
        sortBy,
        ...query,
        limit,
        startAuthor,
        startPermlink,
        createdBefore,
      },
    })
      .then(res =>
        Promise.all(res.data.results.map(post => /* loop through each post from the db */
          (!_.get(posts, `@${post.author}/${post.permlink}`) ?
            /* get the post from steem if not stored */
            steemAPI.getContentAsync(post.author, post.permlink)
              .then(steemPost => getPostData(steemPost, post))
              .catch(() => Promise.resolve(null)) /* carry on if error finding post */
            : _.get(posts, `@${post.author}/${post.permlink}`)
          )))
          .then(p => ({
            count: res.data.count,
            posts: p.filter(post => post !== null), /* eliminate posts that errored */
          }))),
    meta: {
      sortBy,
      category: category || 'all',
      limit,
      lastPost,
    },
  });
};

export const fetchSubscriptions = ({ limit = 20 }, reload) => (
  dispatch,
  getState,
  { steemAPI },
) => {
  const state = getState();
  const posts = getPosts(state);
  dispatch({
    type: FETCH_POSTS,
    payload: axios.get(`${process.env.API_URL}/subscriptions`, { params: { limit }, ...getAuthHeaders() })
      .then(res =>
        Promise.all(res.data.results.map(post => /* loop through each post from the db */
          (!_.get(posts, `@${post.author}/${post.permlink}`) ?
          /* get the post from steem if not stored */
            steemAPI.getContentAsync(post.author, post.permlink)
              .then(steemPost => getPostData(steemPost, post))
              .catch(() => Promise.resolve(null)) /* carry on if error finding post */
            : _.get(posts, `@${post.author}/${post.permlink}`)
          )))
          .then(p => ({
            count: res.data.count,
            posts: p.filter(post => post !== null), /* eliminate posts that errored */
          }))),
    meta: {
      sortBy: 'created',
      category: 'subscriptions',
      limit,
      reload,
    },
  });
};

export const fetchMoreSubscriptions = ({ limit = 20 }) => (
  dispatch,
  getState,
  { steemAPI },
) => {
  const state = getState();
  const feed = getFeed(state);
  const posts = getPosts(state);
  const feedContent = getFeedFromState('created', 'subscriptions', feed);
  const lastPost = posts[feedContent[feedContent.length - 1]];
  const { createdAt: createdBefore } = lastPost;
  dispatch({
    type: FETCH_POSTS,
    payload: axios.get(`${process.env.API_URL}/subscriptions`, { params: { limit, createdBefore }, ...getAuthHeaders() })
      .then(res =>
        Promise.all(res.data.results.map(post => /* loop through each post from the db */
          (!_.get(posts, `@${post.author}/${post.permlink}`) ?
          /* get the post from steem if not stored */
            steemAPI.getContentAsync(post.author, post.permlink)
              .then(steemPost => getPostData(steemPost, post))
              .catch(() => Promise.resolve(null)) /* carry on if error finding post */
            : _.get(posts, `@${post.author}/${post.permlink}`)
          )))
          .then(p => ({
            count: res.data.count,
            posts: p.filter(post => post !== null), /* eliminate posts that errored */
          }))),
    meta: {
      sortBy: 'created',
      category: 'subscriptions',
      limit,
      lastPost,
    },
  });
};

/* Update new post form data */
export const newPostInfo = data => ({
  type: NEW_POST_INFO,
  payload: data,
});

const broadcastComment = (
  steemConnectAPI,
  parentAuthor,
  parentPermlink,
  author,
  title,
  body,
  jsonMetadata,
  permlink,
) => {
  const operations = [];
  /* add main post */
  const commentOp = [
    'comment',
    {
      parent_author: parentAuthor,
      parent_permlink: parentPermlink,
      author,
      permlink,
      title,
      body,
      json_metadata: JSON.stringify(jsonMetadata),
    },
  ];
  operations.push(commentOp);

  /* add beneficiary - will change when live */
  const commentOptionsConfig = {
    author,
    permlink,
    allow_votes: true,
    allow_curation_rewards: true,
    max_accepted_payout: '1000000.000 SBD',
    percent_steem_dollars: 10000,
    extensions: [
      [
        0,
        {
          beneficiaries: [{ account: 'review.app', weight: 1500 }],
        },
      ],
    ],
  };

  /* combine both operations */
  operations.push(['comment_options', commentOptionsConfig]);

  /* croadcast the operations */
  return steemConnectAPI.broadcast(operations);
};

export const createPost = postData => (dispatch, getState, { steemConnectAPI }) => {
  const {
    parentAuthor,
    parentPermlink,
    author,
    title,
    body,
    jsonMetadata,
  } = postData;
  /* get correctly formatted permlink */
  const getPermLink = createPermlink(title, author, parentAuthor, parentPermlink);

  dispatch({
    type: CREATE_POST,
    payload: getPermLink.then(permlink =>
      broadcastComment(
        steemConnectAPI,
        parentAuthor,
        parentPermlink,
        author,
        title,
        body,
        jsonMetadata,
        permlink,
      ).then(() => axios.post(`${process.env.API_URL}/posts/add`, { author, permlink }, getAuthHeaders()).then(() => dispatch(push(`/@${author}/${permlink}`))))),
    meta: {
      globalError: 'Sorry, an error ocurred adding your post',
    },
  });
};

export const votePost = (author, permlink, type = 'post', weight = 10000) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) {
    return null;
  }

  const voter = auth.user.name;

  return dispatch({
    type: LIKE_POST,
    payload: steemConnectAPI.vote(voter, author, permlink, weight).then((res) => {
      if (type === 'post') {
        dispatch(fetchPost(author, permlink, true)).then(() => res);
      } else if (type === 'comment') {
        dispatch(fetchReply(author, permlink, true)).then(() => res);
      }
    }),
    meta: {
      postId: `@${author}/${permlink}`,
      weight,
    },
  });
};

export default fetchPosts;
