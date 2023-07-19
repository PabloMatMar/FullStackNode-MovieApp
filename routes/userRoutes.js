const express = require('express');
const userCrontollers = require('../controllers/userControllers');
const userRouter = express.Router();

userRouter.get('/', userCrontollers.renderUserView);
userRouter.get('/updtAvatar/:errForm', userCrontollers.renderFormUpdtAvatar);
userRouter.get('/updtPassword/:errForm', userCrontollers.renderFormUpdtPassword);
userRouter.get('/deleteUser/:errForm', userCrontollers.renderFormDeleteUser);
userRouter.put('/updtAvatar', userCrontollers.changesAvatar);
userRouter.put('/updtPassword', userCrontollers.changesPassword);
userRouter.delete('/deleteUser', userCrontollers.deleteUser);

module.exports = userRouter