/**
 * @author Pablo Mateos 
 * @version 2.0
 * @namespace ControllersBackend
 */

require('dotenv').config();
const Movies = require('../models/moviesMongo');
const scraper = require('../utils/scraper');
const { API_KEY } = process.env

/**
 * Description: This function renders the search view
 * @memberof  ControllersBackend
 * @method  getSearch
 * @async 
 * @param {Object} res - HTTP response to render view home
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
 * Description: This function run the scrapping.
 * @memberof ControllersBackend
 * @method startScraping
 * @async 
 * @param {string} title - The title to search reviews whit the scraped
 * @return {Object} - Containing the scraped reviews
 * @throws {Err} message with the error during the scraping process
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
 * @memberof ControllersBackend
 * @method postFilmForm
 * @async 
 * @param {string} req.body.title - title of the searched movie
 * @param {Object} res - HTTP response to redirect to path that search the movie in the mongo database
 */
const postFilmForm = async (req, res) => {
    try {
        res.redirect("/search/local/" + req.body.title.toLowerCase().trim());
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};


/**
 * Description: Find the movie in mongo. If it finds it, it redirects the search to the api
 * @memberof ControllersBackend
 * @method getSearchForTitleInMongo 
 * @async 
 * @param {string} req.params.title - The title of the movie that has been redirected from postfilm
 * @param {Array} movie - The array whit the movies finded in mongo. Only takes the first.
 * @param {Object} res - if the movie is finded the HTTP response is to render search view, else HTTP response redirect the search to the api
 * @return {Object} - try find movie in mongo.
 * @throws {Err} message with the error during the search process.
 */

const getSearchForTitleInMongo = async (req, res) => {
    try {
        let movie = await Movies.find({ title: req.params.title }, { _id: 0, __v: 0 });
        movie[0] != undefined ? res.status(200).render("search", { categories: { ...movie[0] }._doc, excludes: ['poster', 'critics', 'poster'] }) : res.redirect("/search/" + req.params.title);
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};

/**
 * Description: This function saves in mongo the movie(and scraped) found in the api.
 * @memberof ControllersBackend
 * @method pushApiMovieInMongo
 * @async 
 * @param {Object} answer - Response of the attempt to save the movie in mongo
 * @throws {Err} message with the error during the save process.
 */


const pushApiMovieInMongo = async (categories) => {
    try {
        const response = await new Movies(categories);
        let answer = await response.save();
        console.log("Push movie ", answer, " to MongoDB")
    } catch (err) {
        console.log(err);
    };
};

/**
 * Description: This function search de movie in api
 * @memberof ControllersBackend
 * @method getSearchForTitle
 * @async 
 * @param {string} req.params.title - The title of the movie that has been redirected from getSearchForTitleInMongo
 * @param {string} API_KEY - The key of the API movies
 * @param {string} categoriesMovie.Error  - If this is not equal to "Movie not found" then movie rendering is started, else, the search view is rendered with the noMovie property set to true
 * @param {Object} scrappingCritics - The reviews obtained in the scraped. Value of property is an Array.
 * @param {Object} categories - It contains the properties and values ​​of the movie from the api but correcting the bad practice in the naming of the properties without camel case.
 * @param {function} pushApiMovieInMongo - Call to the function that saves the movie from the api plus the scrapping reviews in mongo
 * @param {string} Title - The value of the title property is passed to lower case to unify searches once it is saved in mongo
 * @param {Array} exclude - Array with the categories that the pug loop should not render.

 * @param {Object} res - HTTP response is to render search view (movie or noMovie depending categoriesMovie.Error)
 * @throws {Err} message with the error during the search process
 */

const getSearchForTitle = async (req, res) => {
    try {
        const resp = await fetch(`http://www.omdbapi.com/?t=${req.params.title}&apikey=` + API_KEY);
        let categoriesMovie = await resp.json();
        if (categoriesMovie.Error != 'Movie not found!') {
            console.log("FIND MOVIE IN API");
            const scrapingCritics = { "critics": await startScraping(categoriesMovie.Title)}
            let categories = {};
            Object
                .keys(categoriesMovie)
                .map((_, i, arrOfKeys) => arrOfKeys[i] == 'Title' ? categories[arrOfKeys[i].toLowerCase()] = categoriesMovie[arrOfKeys[i]].toLowerCase() : categories[arrOfKeys[i].toLowerCase()] = categoriesMovie[arrOfKeys[i]]);
            // Mongo Saves movie and scraping
            pushApiMovieInMongo({ ...categories, ...scrapingCritics });
            res.status(200).render("search", { categories: { ...categories, ...scrapingCritics }, excludes: ['rated', 'released', 'writer', 'awards', 'ratings', 'metascore', 'imdbrating', 'imdbvotes', 'imdbid', 'type', 'dvd', 'boxoffice', 'production', 'response', 'website', 'poster', 'critics', 'poster', 'country'] });
        } else {
            res.render("search", { noMovie: true });
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