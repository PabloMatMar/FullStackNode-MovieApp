const express = require('express');
const searchCrontrolers = require('../controllers/searchControllers');
const searchRouter = express.Router();

searchRouter.get('/', searchCrontrolers.renderSearchView);
searchRouter.get('/:title', searchCrontrolers.searchMovieInExternalApi);
searchRouter.get('/local/:title', searchCrontrolers.searchMovieInMongoApi);
searchRouter.post('/', searchCrontrolers.postFilmForm);
searchRouter.post('/transferToMongo/', searchCrontrolers.pushMigration);

module.exports = searchRouter