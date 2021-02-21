const express = require('express');
const app = express();

require('dotenv').config();
require('./Utils/init_mongodb');

const AuthRoute = require('./Routes/Auth.route');

app.get('/', (req, res, next) => {
  res.send('HOME');
});

app.use('/auth', AuthRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}...`);
});
