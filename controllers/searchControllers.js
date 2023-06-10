//search controllers

/**
 * @author Pablo Mateos 
 * @exports search
 * @namespace searchControllers
 */

require('dotenv').config();
const Movies = require('../models/moviesMongo');
const scraper = require('../utils/scraper');
const { updateMovie } = require('./updateMovieControllers');
const { API_KEY } = process.env

/**
 * Description: This function renders the search view
 * @memberof  Renders
 * @method  getSearch
 * @async 
 * @categories {Object} req HTTP request object
 * @categories {Object} res HTTP response object
 * @throws {Err} message with the error when render search view.
 */

const getSearch = (req, res) => {
    try {
        res.render('search');
    } catch (err) {
        res.status(500).send({ err });
    };
};

/**
 * Description: This function gets all the movies in the database.
 * @memberof searchControllers
 * @method startScraping
 * @async 
 * @categories {string} title - The title to search for.
 * @return {Object} - an object containing the scraped info.
 * @throws {Err} message with the error during the scraping process.
 */

const startScraping = async (title) => {
    try {
        const movies = await scraper.scrap("https://www.filmaffinity.com/en/search.php?stype=title&stext=" + title);
        return movies;
    } catch (err) {
        res.status(500).send({ err });
    };
};

/**
 * Description: This function collects the name of the movie that the user wants to search.
 * @memberof searchControllers
 * @method postFilmForm
 * @async 
 * @categories {Object} req HTTP request object
 * @categories {Object} res HTTP response object
 * @categories {string} title - The title to search for.
 * @return {void} The function does not return any value.
 */
const postFilmForm = async (req, res) => {
    try {
        res.redirect("/search/local/" + req.body.title.toLowerCase());
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};


/**
 * Description: This function searches first in mongo, if it does not find the movie there it redirects the search to the api
 * @memberof searchControllers
 * @method getSearchForTitleInMongo 
 * @async 
 * @categories {Object} req HTTP request object
 * @categories {Object} res HTTP response object
 * @return {Object} - try find movie in mongo.
 * @throws {Err} message with the error during the search process.
 */

const getSearchForTitleInMongo = async (req, res) => {
    try {
        let movie = await Movies.find({ title: req.params.title }, { _id: 0, __v: 0 });
        movie[0] != undefined ? res.status(200).render("search", { categories: movie[0] }) : res.redirect("/search/" + req.params.title);
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};

/**
 * Description: This function looks for the movie in the api, if it doesn't find it, it renders a movie view not found
 * @memberof searchControllers
 * @method pushMovieApiInMongo
 * @async 
 * @categories {Object} req HTTP request object
 * @categories {Object} res HTTP response object
 * @return {Object} - Mongo saves the movie and the reviews from the scraping, so that once a user searches for it, the rest will have it without having to wait for the scraping.
 * @throws {Err} message with the error during the search process.
 */


const pushMovieApiInMongo = async (categories) => {
    try {
        const response = await new Movies(categories);
        let answer = await response.save();
        console.log("Push movie ", answer, " to MongoDB")
    } catch (err) {
        console.log(err);
    };
};

/**
 * Description: This function looks for the movie in the api, if it doesn't find it, it renders a movie view not found
 * @memberof searchControllers
 * @method getSearchForTitle
 * @async 
 * @categories {Object} req HTTP request object
 * @categories {Object} res HTTP response object
 * @return {Object} - try find movie in API.
 * @throws {Err} message with the error during the search process.
 */

const getSearchForTitle = async (req, res) => {
    try {
        const resp = await fetch(`http://www.omdbapi.com/?t=${req.params.title}&apikey=` + API_KEY);
        let categoriesMovie = await resp.json();
        if (categoriesMovie.Error != 'Movie not found!') {
            console.log("FIND MOVIE IN API");
            const critics = await startScraping(categoriesMovie.Title);
            const scrapingCritics = { "critics": critics }
            let categories = {};
            Object
                .keys(categoriesMovie)
                .map((e, i, keys) => keys[i] == 'Title' ? categories[keys[i].toLowerCase()] = categoriesMovie[keys[i]].toLowerCase() : categories[keys[i].toLowerCase()] = categoriesMovie[keys[i]]);
            pushMovieApiInMongo({ ...categories, ...scrapingCritics });// Mongo Saves movie and scraping
            res.status(200).render("search", { categories: { ...categories, ...scrapingCritics } });
        } else {
            res.render("noMovie");
        };
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};

module.exports = {
    getSearch,
    getSearchForTitle,
    postFilmForm,
    getSearchForTitleInMongo,
    startScraping
}