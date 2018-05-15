const steem = require('steem');

const steemAPI = steem.api;
steemAPI.setOptions({ url: process.env.STEEM_API_URL || 'https://api.steemit.com' });

module.exports = steemAPI;
