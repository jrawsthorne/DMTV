import sc2 from 'sc2-sdk';

const api = sc2.Initialize({
  app: 'review.app',
  baseURL: 'https://v2.steemconnect.com',
  callbackURL: process.env.STEEMCONNECT_REDIRECT_URL,
});

export default api;
