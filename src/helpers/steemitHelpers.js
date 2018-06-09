import base58 from 'bs58';
import getSlug from 'speakingurl';
import secureRandom from 'secure-random';
import steemAPI from '../apis/steemAPI';

function checkPermLinkLength(permlink) {
  let newPermlink = permlink;
  if (newPermlink.length > 255) {
    // STEEMIT_MAX_PERMLINK_LENGTH
    newPermlink = newPermlink.substring(newPermlink.length - 255, newPermlink.length);
  }
  // only letters numbers and dashes shall survive
  newPermlink = newPermlink.toLowerCase().replace(/[^a-z0-9-]+/g, '');
  return newPermlink;
}

function slug(text) {
  return getSlug(text.replace(/[<>]/g, ''), { truncate: 128 });
}

/**
 * Generate permlink
 * https://github.com/steemit/steemit.com/blob/ded8ecfcc9caf2d73b6ef12dbd0191bd9dbf990b/app/redux/TransactionSaga.js
 */

export function createPermlink(title, author, parentAuthor, parentPermlink) {
  let permlink;
  if (title && title.trim() !== '') {
    let s = slug(title);
    if (s === '') {
      s = base58.encode(secureRandom.randomBuffer(4));
    }

    return steemAPI
      .getContentAsync(author, s)
      .then((content) => {
        let prefix;
        if (content.body !== '') {
          // make sure slug is unique
          prefix = `${base58.encode(secureRandom.randomBuffer(4))}-`;
        } else {
          prefix = '';
        }
        permlink = prefix + s;
        return checkPermLinkLength(permlink);
      })
      .catch((err) => {
        console.warn('Error while getting content', err);
        return permlink;
      });
  }
  // comments: re-parentauthor-parentpermlink-time
  const timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '');
  const newParentPermlink = parentPermlink.replace(/(-\d{8}t\d{9}z)/g, '');
  permlink = `re-${parentAuthor}-${newParentPermlink}-${timeStr}`;
  return Promise.resolve(checkPermLinkLength(permlink));
}

export default createPermlink;
