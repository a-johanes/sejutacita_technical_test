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

router.post('/', verifyAccessToken, verifyAdmin, async (req, res, next) => {
  // create new user
  // admin only
  try {
    const newAuth = await new User(req.body).save();

    res.statusCode = 201;
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
      let errorKeyString = User.getError(error);
      if (errorKeyString) return next(createError.UnprocessableEntity(error.errors[errorKeyString].message));
    }
    next(error);
  }
});

router.put('/', verifyAccessToken, verifyAdmin, async (req, res, next) => {
  // update current user info
  // admin only
  try {
    const user = res.locals.user;
    const userKeyList = Object.keys(User.schema.obj);
    const updateUserKeyList = Object.keys(req.body);
    if (!updateUserKeyList.some((key) => userKeyList.indexOf(key) >= 0)) return res.sendStatus(204);
    if (req.body.isAdmin) {
      req.body.isAdmin = Boolean(req.body.isAdmin);
    }
    await User.validate(req.body, updateUserKeyList);
    const newUser = await User.findOneAndUpdate({ username: user.username }, req.body, { new: true });
    await newUser.save();
    res.send(newUser);
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
});

router.put('/:id', verifyAccessToken, verifyAdmin, async (req, res, next) => {
  // update specific user info
  // admin only
  try {
    const userKeyList = Object.keys(User.schema.obj);
    const updateUserKeyList = Object.keys(req.body);
    if (!updateUserKeyList.some((key) => userKeyList.indexOf(key) >= 0)) return res.sendStatus(204);
    if (req.body.isAdmin) {
      req.body.isAdmin = Boolean(req.body.isAdmin);
    }
    await User.validate(req.body, updateUserKeyList);
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) throw createError.NotFound();
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error.message);
    if (error instanceof mongoose.Error.CastError) {
      return next(createError.BadRequest());
    }
    if (error instanceof mongodb.MongoError) {
      if (error.code == 11000) {
        // dulicate key error
        const username = error.keyValue[Object.keys(error.keyValue)[0]];
        return next(createError.Conflict(`${username} is already been registered`));
      }
    }
    if (error instanceof mongoose.Error.ValidationError) {
      console.log(error.errors['isAdmin'].message);
      let errorKeyString = User.getError(error);
      if (errorKeyString) return next(createError.UnprocessableEntity(error.errors[errorKeyString].message));
    }
    next(error);
  }
});

module.exports = router;
