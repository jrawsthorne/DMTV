const express = require('express');

const app = express();

app.get('/callback', (req, res) => {
  const { access_token: accessToken, expires_in: expiresIn, state } = req.query;
  const next = state && state[0] === '/' ? state : '/';
  if (accessToken && expiresIn) {
    res.cookie('access_token', accessToken, { maxAge: expiresIn * 1000 });
    res.redirect(next);
  } else {
    res.status(401).send({ error: 'access_token or expires_in Missing' });
  }
});

app.listen(3001);
