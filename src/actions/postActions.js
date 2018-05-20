import axios from 'axios';
import _ from 'lodash';
import steemAPI from '../apis/steemAPI';
import { FETCH_POSTS, FETCH_POST } from './types';

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
    .then(steemPost => steemPost.id !== 0 && steemPost),
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
        Promise.all(res.data.results.map(post =>
          (!_.get(posts, `@${post.author}/${post.permlink}`) ?
            steemAPI.getContentAsync(post.author, post.permlink)
              .then(steemPost => getPostData(steemPost, post))
              .catch(() => Promise.resolve(null))
            : _.get(posts, `@${post.author}/${post.permlink}`)
          )))
          .then(p => ({
            count: res.data.count,
            posts: p.filter(post => post !== null),
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

export default fetchPosts;
