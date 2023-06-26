const express = require('express');
const userCrontrolers = require('../controllers/userControllers');
const userSingupRouter = express.Router();

userSingupRouter.post('/', userCrontrolers.createUser);
userSingupRouter.get('/:errSignup', userCrontrolers.getSingup);

module.exports = userSingupRouter