const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');

require('dotenv').config();
require('./Utils/init_mongodb');

const AuthRoute = require('./Routes/Auth.route');

const app = express();
app.use(morgan('dev'));
app.use(express.json()); // parse json body
app.use(express.urlencoded({ extended: true })); // parse url encoded to json

app.use('/users/auth', AuthRoute);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}...`);
});
