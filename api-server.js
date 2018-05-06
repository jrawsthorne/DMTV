const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const posts = require('./src/apis/routes/posts');

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI);

app.use('/api/posts', posts);

app.get('/*', (req, res) => res.status(401).send({ error: 'Route not found' }));

app.listen(3002);
