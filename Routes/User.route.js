const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../Utils/jwt');
const UserController = require('../Controllers/User.controller');

router.get('/', verifyAccessToken, UserController.getUserInfo);

router.get('/all/', verifyAccessToken, UserController.verifyAdmin, UserController.getAllUserInfo);

router.get('/:id', verifyAccessToken, UserController.verifyAdmin, UserController.getUserInfoById);

router.post('/', verifyAccessToken, UserController.verifyAdmin, UserController.createUser);

router.put('/', verifyAccessToken, UserController.verifyAdmin, UserController.updateUserInfo);

router.put('/:id', verifyAccessToken, UserController.verifyAdmin, UserController.updateUserInfoById);

router.delete('/', verifyAccessToken, UserController.verifyAdmin, UserController.deleteUser);

router.delete('/all/', verifyAccessToken, UserController.verifyAdmin, UserController.deleteAllUser);

router.delete('/:id', verifyAccessToken, UserController.verifyAdmin, UserController.deleteUserById);

module.exports = router;
