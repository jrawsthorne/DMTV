const steem = require('steem');

// set steem api to testnet
// steem.config.set('address_prefix', 'STX');
// steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673');

const steemAPI = steem.api;
// steemAPI.setOptions({ url: 'http://testnet.steem.vc' });


module.exports = steemAPI;
