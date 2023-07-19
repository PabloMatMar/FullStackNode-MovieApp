const express = require('express');
const homeCrontrolers = require('../controllers/homeControllers');
const homeRouter = express.Router();

homeRouter.get('/home/:messageToUsers', homeCrontrolers.getHome);

module.exports = homeRouter