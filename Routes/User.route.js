const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const User = require('../Models/User.model');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const { createAccessToken, verifyAccessToken, createRefreshToken } = require('../Utils/jwt');

getErrors = (error) => {
  if (error.errors['username']) {
    return 'username';
  }
  if (error.errors['password']) {
    return 'password';
  }
};

router.get('/', verifyAccessToken, async (req, res, next) => {
  res.send('info route');
  //   next(createError.Forbidden());
});

router.post('/register', async (req, res, next) => {
  try {
    delete req.body['refreshToken'];
    delete req.body['isAdmin'];
    const newAuth = await new User(req.body).save();

    res.send({ username: newAuth.username, password: newAuth.password });
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

    if (!(await user.isPasswordValid(req.body.password)))
      throw createError.Unauthorized('Username/Password is not valid');

    const refreshToken = await createRefreshToken(user.id);
    const accessToken = await createAccessToken(user.id, refreshToken);
    user.refreshToken = refreshToken;
    await user.save();

    res.send({ accessToken, refreshToken });
  } catch (error) {
    console.log(error.message);

    if (error instanceof mongoose.Error.ValidationError) {
      return next(createError.BadRequest('Invalid Username/Password'));
    }

    next(error);
  }
});

router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const user = await verifyRefreshToken(refreshToken);

    const accessToken = await createAccessToken(user.id, refreshToken);
    user.token = { accessToken, refreshToken };
    await user.save();
    res.send(user.token);
  } catch (error) {
    next(error);
  }
});

router.delete('/logout', async (req, res, next) => {
  res.send('logout route');
});

module.exports = router;
