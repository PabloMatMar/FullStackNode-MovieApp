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
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 */

const getSearch = (req, res) => res.render('search');

/**
 * Description: This function gets all the movies in the database.
 * @memberof searchControllers
 * @method startScraping
 * @async 
 * @param {string} title - The title to search for.
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
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @return {Object} - an object containing the scraped info.
 * @throws {Error} message with the error during the search process.
 */

const getSearchForTitleInMongo = async (req, res) => {
    try {
        let movie = await Movies.find({ title: req.params.title }, { _id: 0, __v: 0 });
        if (movie[0] != undefined) {
            console.log("SEARCH MONGO");
            const critics = await startScraping(req.params.title);
        res.status(200).render("searchInMongoForTitle", { param: movie[0], critics});

        } else {
            res.redirect("/search/" + req.params.title);
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
};

/**
 * Description: This function looks for the movie in the api, if it doesn't find it, it renders a movie view not found
 * @memberof searchControllers
 * @method getSearchForTitle
 * @async 
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @return {Object} - an object containing the scraped info.
 * @throws {Error} message with the error during the search process.
 */
const getSearchForTitle = async (req, res) => {
    try {
        const resp = await fetch(`http://www.omdbapi.com/?t=${req.params.title}&apikey=` + API_KEY);
        let param = await resp.json();
        if (param.Response) {
            console.log("SEARCH TITLE");
            const critics = await startScraping(req.params.title);
            res.status(200).render("searchTitle", { param, critics });

        } else {
            res.render("noMovie");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ err: err.message });
    }
};

/**
 * Description: This function collects the name of the movie that the user wants to search.
 * @memberof searchControllers
 * @method postFilmForm
 * @async 
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @param {string} title - The title to search for.
 * @return {void} The function does not return any value.
 */
const postFilmForm = async (req, res) => res.redirect("/search/local/" + req.body.title);



module.exports = {
    getSearch,
    getSearchForTitle,
    postFilmForm,
    getSearchForTitleInMongo,
    startScraping
}