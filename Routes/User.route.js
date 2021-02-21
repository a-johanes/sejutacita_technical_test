const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const User = require('../Models/User.model');
const mongoose = require('mongoose');
const mongodb = require('mongodb');

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

    if (error instanceof mongodb.MongoError) {
      if (error.code == 11000) {
        // dulicate key error
        const username = error.keyValue[Object.keys(error.keyValue)[0]];
        return next(createError.Conflict(`${username} is already been registered`));
      }
    }

    if (error instanceof mongoose.Error.ValidationError) {
      let errorKeyString = getErrors(error);
      if (errorKeyString) return next(createError.UnprocessableEntity(error.errors[errorKeyString].message));
    }
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    await User.validate(req.body);
    const user = await User.findOne({ username: req.body.username });
    if (!user) throw createError.NotFound('User not registered');

    res.send(user);
  } catch (error) {
    console.log(error.message);

    if (error instanceof mongoose.Error.ValidationError) {
      let errorKeyString = getErrors(error);
      if (errorKeyString) return next(createError.UnprocessableEntity(error.errors[errorKeyString].message));
    }

    next(error);
  }
});

router.post('/refresh-token', async (req, res, next) => {
  res.send('refresh token route');
});

router.delete('/logout', async (req, res, next) => {
  res.send('logout route');
});

module.exports = router;
