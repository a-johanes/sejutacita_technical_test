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
});

UserSchema.pre('save', async function (next) {
  try {
    // only hash if new
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
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

const User = mongoose.model('user', UserSchema);
module.exports = User;
