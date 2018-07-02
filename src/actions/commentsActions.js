import { FETCH_REPLIES } from './types';

// fetch replies from steem api
export const fetchReplies = (author, permlink, id, afterLike = false) => (
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
    afterLike,
    globalError: 'Sorry, there was an error fetching replies',
  },
});

export default fetchReplies;
