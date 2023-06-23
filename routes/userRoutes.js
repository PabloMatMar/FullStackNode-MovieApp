const express = require('express');
const userCrontrolers = require('../controllers/userControllers');
const userRouter = express.Router();

userRouter.get('/', userCrontrolers.renderUserView);
userRouter.get('/updtAvatar/:errForm', userCrontrolers.renderFormUpdtAvatar);
userRouter.get('/updtPassword/:errForm', userCrontrolers.renderFormUpdtPassword);
userRouter.post('/updtAvatar', userCrontrolers.changesAvatar);
userRouter.post('/updtPassword', userCrontrolers.changesPassword);


module.exports = userRouter