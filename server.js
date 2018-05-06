const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

const posts = require('./src/apis/routes/posts');

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI);

app.use(express.static('public'));

app.use('/api/posts', posts);

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
