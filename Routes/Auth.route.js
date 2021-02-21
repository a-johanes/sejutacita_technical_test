const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const Auth = require('../Models/Auth.model');

function checkErrors(error) {
  if (error) {
    if (error.errors['username']) {
      throw createError.BadRequest(error.errors['username'].message);
    }
    if (error.errors['password']) {
      throw createError.BadRequest(error.errors['password'].message);
    }
  }
}

router.post('/register', async (req, res, next) => {
  try {
    const newAuth = await new Auth(req.body).save();

    res.send(newAuth);
  } catch (error) {
    console.log(error.message);

    let errorKeyString = '';
    if (error.errors['username']) {
      errorKeyString = 'username';
    } else if (error.errors['password']) {
      errorKeyString = 'password';
    }

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
