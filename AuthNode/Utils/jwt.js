const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../Models/User.model');
const bcrypt = require('bcrypt');

createAccessToken = (userId, refreshToken) => {
  return new Promise(async (resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET + refreshToken;
    const options = {
      expiresIn: '5m',
      issuer: 'test.com',
      audience: userId,
    };
    jwt.sign(payload, secret, options, (error, token) => {
      if (error) {
        console.log(error.message);
        reject(createError.InternalServerError());
        return;
      }
      resolve(token);
    });
  });
};

verifyAccessToken = async (req, res, next) => {
  // called on protected route
  const authHeader = req.headers['authorization'];
  if (!authHeader) return next(createError.Unauthorized());
  const bearerToken = authHeader.split(' ');

  if (bearerToken.length < 2 || bearerToken.length > 2 || bearerToken[0].toLowerCase() !== 'bearer') {
    return next(createError.Unauthorized('Invalid authorization header'));
  }

  const token = bearerToken[1];

  const decodedJWT = jwt.decode(token);
  if (!decodedJWT) return next(createError.Unauthorized());
  const userId = decodedJWT.aud;
  const user = await User.findById(userId);
  if (!user || !user.refreshToken) return next(createError.Unauthorized());
  const secret = process.env.ACCESS_TOKEN_SECRET + user.refreshToken;

  jwt.verify(token, secret, async (error, payload) => {
    if (error) {
      console.log(error.message);
      const message = error.name === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
      return next(createError.Unauthorized(message));
    }
    res.locals.user = user;
    next();
  });
};

createRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: '1y',
      issuer: 'test.com',
      audience: userId,
    };
    jwt.sign(payload, secret, options, (error, token) => {
      if (error) {
        console.log(error.message);
        reject(createError.InternalServerError());
        return;
      }
      resolve(token);
    });
  });
};

verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
      if (err) return reject(createError.Unauthorized());
      const userId = payload.aud;
      const user = await User.findById(userId);
      if (!user) return reject(createError.Unauthorized());
      if (!(await user.isRefreshTokenValid(refreshToken))) return reject(createError.Unauthorized());
      resolve(user);
    });
  });
};

module.exports = {
  createAccessToken,
  verifyAccessToken,
  createRefreshToken,
  verifyRefreshToken,
};
