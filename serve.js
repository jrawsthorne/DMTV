const express = require('express');

const app = express();
const path = require('path');

app.use(express.static('public'));

// viewed at http://localhost:8080
app.get('/*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public/index.html`));
});

app.listen(80);
