const createError = require('http-errors');
const User = require('../Models/User.model');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require('../Utils/jwt');

register = async (req, res, next) => {
  try {
    delete req.body['refreshToken'];
    delete req.body['isAdmin'];
    const newAuth = await new User(req.body).save();

    res.statusCode = 201;

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
      let errorKeyString = User.getError(error);
      if (errorKeyString) return next(createError.UnprocessableEntity(error.errors[errorKeyString].message));
    }
    next(error);
  }
};

login = async (req, res, next) => {
  try {
    await User.validate(req.body);
    const user = await User.findOne({ username: req.body.username });
    if (!user) throw createError.NotFound('User not registered');

    if (!(await user.isPasswordValid(req.body.password)))
      throw createError.Unauthorized('Username/Password is not valid');

    const refreshToken = await createRefreshToken(user.id);
    user.refreshToken = refreshToken;
    await user.save();

    const accessToken = await createAccessToken(user.id, user.refreshToken);

    res.send({ accessToken, refreshToken });
  } catch (error) {
    console.log(error.message);

    if (error instanceof mongoose.Error.ValidationError) {
      return next(createError.BadRequest('Invalid Username/Password'));
    }

    next(error);
  }
};

refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const user = await verifyRefreshToken(refreshToken);

    const accessToken = await createAccessToken(user.id, user.refreshToken);

    res.send({ accessToken });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const user = await verifyRefreshToken(refreshToken);
    user.refreshToken = undefined;
    await user.save();
    res.sendStatus(204);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = { register, login, refreshToken, logout };
