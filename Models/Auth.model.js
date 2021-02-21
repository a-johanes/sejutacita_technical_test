const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthSchema = new Schema({
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
});

const Auth = mongoose.model('auth', AuthSchema);
module.exports = Auth;
