const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');

const posts = require('./src/apis/routes/posts');
const users = require('./src/apis/routes/users');
const ratings = require('./src/apis/routes/ratings');
const subscriptions = require('./src/apis/routes/subscriptions');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI);

app.use(passport.initialize());
require('./src/apis/config/passport')(passport);

let API_PREFIX;
if (process.env.NODE_ENV === 'production') {
  API_PREFIX = '/';
} else {
  API_PREFIX = '/api/';
}

app.use(`${API_PREFIX}posts`, posts);
app.use(`${API_PREFIX}users`, users);
app.use(`${API_PREFIX}subscriptions`, subscriptions);
app.use(`${API_PREFIX}ratings`, ratings);

app.get('/*', (req, res) => res.status(401).send({ error: 'Route not found' }));

app.listen(3002);
