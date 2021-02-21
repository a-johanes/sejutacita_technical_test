const jwt = require('jsonwebtoken');
const createError = require('http-errors');

createAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: '1h',
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

verifyAccessToken = (req, res, next) => {
  // called on protected route
  const authHeader = req.headers['authorization'];
  if (!authHeader) return next(createError.Unauthorized());
  const bearerToken = authHeader.split(' ');

  if (bearerToken.length < 2 || bearerToken.length > 2 || bearerToken[0].toLowerCase() !== 'bearer') {
    return next(createError.Unauthorized('Invalid authorization header'));
  }

  const token = bearerToken[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
    if (error) {
      const message = error.name === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
      return next(createError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
};

module.exports = {
  createAccessToken,
  verifyAccessToken,
};
