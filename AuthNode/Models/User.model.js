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
    // only hash if not hashed
    if (this.password && !this.password.startsWith('$2b')) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    if (this.refreshToken && !this.refreshToken.startsWith('$2b')) {
      this.refreshToken = await bcrypt.hash(this.refreshToken, 10);
    }
    next();
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

UserSchema.methods.isPasswordValid = async function (password) {
  try {
    const encrypted = this.password ? this.password : '';
    return await bcrypt.compare(password, encrypted);
  } catch (error) {
    throw error;
  }
};

UserSchema.methods.isRefreshTokenValid = async function (refreshToken) {
  try {
    const encrypted = this.refreshToken ? this.refreshToken : '';
    return await bcrypt.compare(refreshToken, encrypted);
  } catch (error) {
    throw error;
  }
};

UserSchema.statics.getError = function (error) {
  if (error.errors['username']) {
    return 'username';
  }
  if (error.errors['password']) {
    return 'password';
  }
};

const User = mongoose.model('user', UserSchema);
module.exports = User;
