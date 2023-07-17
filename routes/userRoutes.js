const express = require('express');
const userCrontollers = require('../controllers/userControllers');
const userRouter = express.Router();

userRouter.get('/', userCrontollers.renderUserView);
userRouter.get('/updtAvatar/:errForm', userCrontollers.renderFormUpdtAvatar);
userRouter.get('/updtPassword/:errForm', userCrontollers.renderFormUpdtPassword);
userRouter.get('/deleteUser/:errForm', userCrontollers.renderFormDeleteUser);
userRouter.post('/updtAvatar', userCrontollers.changesAvatar);
userRouter.post('/updtPassword', userCrontollers.changesPassword);
userRouter.post('/deleteUser', userCrontollers.deleteUser);

module.exports = userRouter