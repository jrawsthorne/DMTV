import axios from 'axios';
import _ from 'lodash';
import steemAPI from '../apis/steemAPI';
import { FETCH_POSTS, FETCH_POST } from './types';

// return only data we need
const getPostData = (steemPost, post) => ({
  id: steemPost.id,
  title: steemPost.title,
  author: steemPost.author,
  url: `@${steemPost.author}/${steemPost.permlink}`,
  permlink: steemPost.permlink,
  body: steemPost.body,
  postType: post.postType,
  mediaType: post.mediaType,
  tmdbid: post.tmdbid,
  mediaTitle: post.title,
  backdropPath: post.backdropPath || undefined,
  posterPath: post.posterPath || undefined,
  episodePath: post.episodePath || undefined,
  seasonPath: post.seasonPath || undefined,
  seasonNum: post.seasonNum || undefined,
  episodeNum: post.episodeNum || undefined,
  rating: post.rating || undefined,
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

export const fetchPosts = (posts, {
  postType = 'all',
  mediaType = null,
  tmdbid = null,
  seasonNum = null,
  episodeNum = null,
  rating = null,
}) => (dispatch) => {
  dispatch({
    type: FETCH_POSTS,
    payload: axios.get(`${process.env.API_URL}/posts`, {
      params: {
        postType: postType || 'all',
        mediaType: mediaType || undefined,
        tmdbid: tmdbid || undefined,
        seasonNum: seasonNum || undefined,
        episodeNum: seasonNum && episodeNum ? episodeNum : undefined,
        rating: rating || undefined,
      },
    })
      .then(res =>
        Promise.all(res.data.results.filter(post =>
          !_.get(posts, `@${post.author}/${post.permlink}`))
          .map(post => dispatch(fetchPost(post.author, post.permlink))
            .then(() => Promise.resolve(null))))),
    meta: {
      globalError: 'Sorry, there was an error fetching posts',
    },
  });
};

export default fetchPosts;
