import { FETCH_REPLIES, SUBMIT_COMMENT } from './types';
import { createCommentPermlink } from '../helpers/steemitHelpers';
import { fetchReply } from './postActions';

// fetch replies from steem api
export const fetchReplies = (author, permlink, id, reload = false) => (
  dispatch,
  getState,
  { steemAPI },
) => dispatch({
  type: FETCH_REPLIES,
  payload: steemAPI.getContentRepliesAsync(author, permlink).then(replies =>
    Promise.all(replies.map(reply =>
      steemAPI.getActiveVotesAsync(reply.author, reply.permlink).then(votes => ({
        ...reply,
        active_votes: votes,
      }))))),
  meta: {
    author,
    permlink,
    id,
    reload,
    globalError: 'Sorry, there was an error fetching replies',
  },
});

export const submitComment = (
  parentAuthor,
  parentPermlink,
  parentId,
  body,
) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) {
    return null;
  }
  const author = auth.user.name;
  const permlink = createCommentPermlink(parentAuthor, parentPermlink);
  const jsonMetadata = {
    community: 'review',
    app: 'review/0.0.1',
    format: 'markdown',
  };
  return dispatch({
    type: SUBMIT_COMMENT,
    payload: steemConnectAPI.comment(parentAuthor, parentPermlink, author, permlink, '', body, jsonMetadata).then(() =>
      dispatch(fetchReplies(parentAuthor, parentPermlink, parentId, true)).then(() =>
        dispatch(fetchReply(parentAuthor, parentPermlink)))),
    meta: {
      globalError: 'Sorry, there was an error submitting your comment',
      parentId,
    },
  });
};

export default fetchReplies;

