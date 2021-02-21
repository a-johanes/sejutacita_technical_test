const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const User = require('../Models/User.model');

getErrors = (error) => {
  if (error.errors['username']) {
    return 'username';
  }
  if (error.errors['password']) {
    return 'password';
  }
};

router.post('/register', async (req, res, next) => {
  try {
    const newAuth = await new User(req.body).save();

    res.send(newAuth);
  } catch (error) {
    console.log(error.message);

    let errorKeyString = getErrors(error);

    if (errorKeyString) return next(createError.UnprocessableEntity(error.errors[errorKeyString].message));

    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  res.send('login route');
});

router.post('/refresh-token', async (req, res, next) => {
  res.send('refresh token route');
});

router.delete('/logout', async (req, res, next) => {
  res.send('logout route');
});

module.exports = router;
