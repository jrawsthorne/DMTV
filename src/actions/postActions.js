import { getDiscussionsFromAPI } from '../helpers/apiHelpers';

export const fetchPosts = ({ sortBy = 'created', category, limit = 10 }) => ({
  type: 'FETCH_POSTS',
  payload: getDiscussionsFromAPI(sortBy, { category, limit }),
  meta: {
    globalError: 'Sorry, there was an error fetching the reviews',
  },
});

export default fetchPosts;
