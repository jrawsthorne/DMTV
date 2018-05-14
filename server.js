const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('public'));

app.get('/callback', (req, res) => {
  const { access_token: accessToken, expires_in: expiresIn, state } = req.query;
  const next = state && state[0] === '/' ? state : '/';
  if (accessToken && expiresIn) {
    res.cookie('access_token', accessToken, { maxAge: expiresIn * 1000 });
    res.redirect(next);
  } else {
    res.redirect('/');
  }
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public/index.html`));
});

app.listen(3000);
