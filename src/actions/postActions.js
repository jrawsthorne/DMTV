import axios from 'axios';
import _ from 'lodash';
import steemAPI from '../apis/steemAPI';
import { FETCH_POSTS, FETCH_POST, NEW_POST_INFO } from './types';

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
});

// fetch post from db and return steem and db info
export const fetchPost = (author, permlink) => ({
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
    globalError: 'Sorry, there was an error fetching the post',
  },
});

// add sortby options

export const fetchPosts = ({
  postType = 'all',
  mediaType = undefined,
  tmdbid = undefined,
  seasonNum = undefined,
  episodeNum = undefined,
  rating = undefined,
  type = undefined,
  author = undefined,
  subscriptions = false,
}) => (dispatch, getState) => {
  let query;
  /* change api request based on type of feed */
  if (subscriptions) {
    query = 'subscriptions';
  } else {
    query = 'posts';
  }
  const posts = getState().posts.items;
  dispatch({
    type: FETCH_POSTS,
    payload: axios.get(`${process.env.API_URL}/${query}`, {
      params: {
        postType: postType || 'all',
        mediaType: mediaType || undefined,
        type: type || undefined,
        tmdbid: tmdbid || undefined,
        seasonNum: seasonNum || undefined,
        episodeNum: seasonNum && episodeNum ? episodeNum : undefined,
        rating: rating || undefined,
        author: author || undefined,
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
      globalError: 'Sorry, there was an error fetching posts',
      mediaType: mediaType || type || author || (subscriptions && 'subscriptionsFeed') || 'all',
      tmdbid,
      seasonNum,
      episodeNum,
      sortBy: 'created',
    },
  });
};

/* Update new post form data */
export const newPostInfo = data => ({
  type: NEW_POST_INFO,
  payload: data,
});

export default fetchPosts;
