const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const User = require('../Models/User.model');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const { verifyAccessToken } = require('../Utils/jwt');

verifyAdmin = (req, res, next) => {
  const user = res.locals.user;
  if (!user.isAdmin) {
    return next(createError.Forbidden());
  }
  next();
};

router.get('/', verifyAccessToken, async (req, res, next) => {
  // read current user info
  const user = res.locals.user;
  if (user.isAdmin) {
    res.send(user);
  } else {
    res.send({ username: user.username, password: user.password });
  }
});

router.get('/all/', verifyAccessToken, verifyAdmin, async (req, res, next) => {
  // read all user info
  // admin only
  const userList = await User.find();
  res.send(userList);
});

router.get('/:id', verifyAccessToken, verifyAdmin, async (req, res, next) => {
  // read specific user info
  // admin only
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw createError.NotFound();
    res.send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(createError.BadRequest());
    }
    next(error);
  }
});

module.exports = router;
