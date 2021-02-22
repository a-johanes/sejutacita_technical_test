const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username required'],
    unique: [true, 'Username already been taken'],
    validate: {
      validator: function (v) {
        return new Promise(function (resolve, reject) {
          resolve(/^\w{5,12}$/.test(v));
        });
      },
      message: (props) => 'Username must be between 5-12 character, use only alphabet, number, and _ (underscore)!',
    },
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    validate: {
      validator: function (v) {
        return new Promise(function (resolve, reject) {
          resolve(/^.{8,}$/.test(v));
        });
      },
      message: (props) => 'Password must at least 8 characters long',
    },
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  refreshToken: String,
});

UserSchema.pre('save', async function (next) {
  try {
    // only hash if new
    if (this.isNew) {
      this.password = await bcrypt.hash(this.password, 10);
      this.refreshToken = await bcrypt.hash(this.refreshToken, 10);
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isPasswordValid = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

UserSchema.methods.isRefreshTokenValid = async function (refreshToken) {
  try {
    return await bcrypt.compare(refreshToken, this.refreshToken);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('user', UserSchema);
module.exports = User;
