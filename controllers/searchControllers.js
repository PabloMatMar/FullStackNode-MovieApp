//search controllers

/**
 * @author Javier Fuertes, Gabriela García y Pablo Mateos 
 * @exports search
 * @namespace searchControllers
 */
require('dotenv').config();
const Movies = require('../models/moviesMongo');
const scraper = require('../utils/scraper');
const { API_KEY } = process.env

/**
 * Description: This function renders the search view
 * @memberof  Renders
 * @method  getSearch
 * @async 
 * @categories {Object} req HTTP request object
 * @categories {Object} res HTTP response object
 */

const getSearch = (req, res) => res.render('search');

/**
 * Description: This function gets all the movies in the database.
 * @memberof searchControllers
 * @method startScraping
 * @async 
 * @categories {string} title - The title to search for.
 * @return {Object} - an object containing the scraped info.
 * @throws {Error} message with the error during the scraping process.
 */

const startScraping = async (title) => {
    try {
        const movies = await scraper.scrap("https://www.filmaffinity.com/en/search.php?stype=title&stext=" + title);
        return movies;
    } catch (err) {
        res.status(500).send({ err });
    };
}
/**
 * Description: This function searches first in mongo, if it does not find the movie there it redirects the search to the api
 * @memberof searchControllers
 * @method getSearchForTitleInMongo 
 * @async 
 * @categories {Object} req HTTP request object
 * @categories {Object} res HTTP response object
 * @return {Object} - an object containing the scraped info.
 * @throws {Error} message with the error during the search process.
 */

const getSearchForTitleInMongo = async (req, res) => {
    try {
        let movie = await Movies.find({ title: req.params.title }, { _id: 0, __v: 0 });
        if (movie[0] != undefined) {
            console.log("SEARCH MONGO");
            const critics = await startScraping(req.params.title);
            res.status(200).render("search", { categories: movie[0], critics });
        } else {
            res.redirect("/search/" + req.params.title);
        };
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};

/**
 * Description: This function looks for the movie in the api, if it doesn't find it, it renders a movie view not found
 * @memberof searchControllers
 * @method getSearchForTitle
 * @async 
 * @categories {Object} req HTTP request object
 * @categories {Object} res HTTP response object
 * @return {Object} - an object containing the scraped info.
 * @throws {Err} message with the error during the search process.
 */
const getSearchForTitle = async (req, res) => {
    try {
        const resp = await fetch(`http://www.omdbapi.com/?t=${req.params.title}&apikey=` + API_KEY);
        let categoriesMovie = await resp.json();
        if (categoriesMovie.Error != 'Movie not found!') {
            console.log("SEARCH TITLE");
            const critics = await startScraping(req.params.title);
            const categories = {
                title: categoriesMovie.Title,
                year: categoriesMovie.Year,
                runtime: categoriesMovie.Runtime,
                genre: categoriesMovie.Genre,
                director: categoriesMovie.Director,
                actors: categoriesMovie.Actors,
                plot: categoriesMovie.Plot,
                language: categoriesMovie.Language,
                img: categoriesMovie.Poster,
            };
        res.status(200).render("search", { categories, critics });
        } else {
            res.render("noMovie");
        };
    } catch (err) {
        res.status(500).send({ err: err.message });
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



module.exports = {
    getSearch,
    getSearchForTitle,
    postFilmForm,
    getSearchForTitleInMongo,
    startScraping
}