const express = require('express');
const searchCrontrolers = require('../controllers/searchControllers');
const transferToMongoRouter = express.Router();

transferToMongoRouter.get('/', searchCrontrolers.pushMigration);

module.exports = transferToMongoRouter