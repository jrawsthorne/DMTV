import sc2 from 'sc2-sdk';

const api = sc2.Initialize({
  app: 'review.app',
  baseURL: 'https://v2.steemconnect.com',
  callbackURL: 'http://localhost:3000/callback',
});

export default api;
