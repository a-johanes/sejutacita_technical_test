const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const User = require('../Models/User.model');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const { verifyAccessToken } = require('../Utils/jwt');

router.get('/', verifyAccessToken, async (req, res, next) => {
  res.send('info route');
  //   next(createError.Forbidden());
});

module.exports = router;
