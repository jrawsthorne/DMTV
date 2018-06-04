import steemAPI from '../apis/steemAPI';
import { FETCH_ACCOUNT } from './types';

/* fetch account details by username */
export const fetchAccount = name => ({
  type: FETCH_ACCOUNT,
  payload: steemAPI.getAccountsAsync([name]).then((result) => {
    if (!result[0]) {
      throw new Error('User not found');
    } else {
      return result[0];
    }
  }),
  meta: { username: name, globalError: 'Sorry, there was an error fetching that user' },
});

export default fetchAccount;
