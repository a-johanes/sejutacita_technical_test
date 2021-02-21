const express = require('express');
require('dotenv').config();
require('./Utils/init_mongodb');
const app = express();

app.get('/', (req, res, next) => {
  res.send('HOME');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}...`);
});
