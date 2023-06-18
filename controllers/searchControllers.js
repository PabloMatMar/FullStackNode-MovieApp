/**
 * @author Pablo Mateos 
 * @version 2.0
 * @namespace searchControllers
 */

require('dotenv').config();
const Movies = require('../models/moviesMongo');
const scraper = require('../utils/scraper');
const { API_KEY } = process.env;

/**
 * Description: This function renders the search view.
 * @memberof  searchControllers
 * @method  getSearch
 * @async 
 * @param {Object} req - HTTP request.
 * @param {Object} res - HTTP response.
 * @property {boolean} admin - Informs the renderer if it is a user or an administrator so that it displays the corresponding navigation bar.
 * @property {function} res.render - Rendering of the response in the search view.
 * @throws {Error} message with the error when render search view.
 * @property {function} res.status.send - Send a json to error message.
 */

const getSearch = (req, res) => {
    try {
        res.render("search", { admin: req.decoded.admin });
    } catch (err) {
        res.status(500).send({ err });
    };
};

/**
 * Description: This function run the scrapping.
 * @memberof searchControllers
 * @method startScraping
 * @async 
 * @param {string} title - The title to search reviews whit the scraped.
 * @property {function} scraper - Contais the Script of scrapper.
 * @property {function} scrap - The first argument is the url where the data will be searched (filmafinity) the second is the information for the scrapping search selectors (the title of the movie).
 * @return {Object} - Containing the scraped reviews.
 * @throws {Error} message with the error during the scraping process.
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
 * @param {Object} req - HTTP request.
 * @param {Object} res - HTTP response.
 * @property {string} req.body.title - title of the searched movie.
 * @property {function} res.redirect - Redirection of the response to the path that search the movie in the mongo database.
 * @throws {Error} message with the error during the redirection process.
 * @property {function} res.send - Send a json to error message.
 */
const postFilmForm = async (req, res) => {
    try {
        res.redirect("/search/local/" + req.body.title.toLowerCase().trim());
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};


/**
 * Description: Find the movie in mongo. If it finds it, it redirects the search to the api.
 * @memberof searchControllers
 * @method getSearchForTitleInMongo 
 * @async 
 * @param {Object} req - HTTP request.
 * @param {Object} res - HTTP response.
 * @property {string} req.params.title - The title of the movie that has been redirected from postfilm
 * @property {function} find - Method to find in mongo a movie for title.
 * @property {Array} movie - The array whit the movies finded in mongo. Only takes the first element.
 * @property {Array} categories - The array whit the values to render in the pug template.
 * @property {function} res.render - if the movie is finded the rendering of the response is produced in the search view
 * @property {function} res.redirect if the movie is not finded the response is redirected to path that search in the api.
 * @return {Object} - try find movie in mongo.
 * @throws {Error} message with the error during the search process.
 */

const getSearchForTitleInMongo = async (req, res) => {
    try {
        const movie = await Movies.find({ title: req.params.title }, { _id: 0, __v: 0 });
        movie[0] != undefined ? res.status(200).render("search", { categories: { ...movie[0] }._doc, excludes: ['poster', 'critics', 'poster'] }) : res.redirect("/search/" + req.params.title);
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};

/**
 * Description: This function saves in mongo the movie(and scraped) found in the api.
 * @memberof searchControllers
 * @method pushApiMovieInMongo
 * @async 
 * @param {object} movie - Movie and reviews values to send mongo to create a movie.
 * @property {function} Movies - Method that caugth mongo schema to insert a movie in mongo.
 * @property {function} save - The method to save the movie in mongo.
 * @property {Object} answer - Response of the attempt to save the movie in mongo.
 * @throws {Error} console.log message with the error during the save process.
 */


const pushApiMovieInMongo = async (movie) => {
    try {
        const response = await new Movies(movie);
        const answer = await response.save();
        console.log("Push movie ", answer, " to MongoDB")
    } catch (err) {
        console.log(err);
    };
};

/**
 * Description: This function search de movie in api.
 * @memberof searchControllers
 * @method getSearchForTitle
 * @async 
 * @param {Object} req - HTTP request.
 * @param {Object} res - HTTP response.
 * @property {function} fetch - Make a get request to url `http://www.omdbapi.com/?t=${req.params.title}&apikey=` + API_KEY
 * @property {string} req.params.title - The title of the movie to search in API.
 * @property {string} API_KEY - The key of the API movies.
 * @property {string} categoriesMovie.Error  - If this is not equal to "Movie not found" then movie rendering is started, else, the search view is rendered with the noMovie property set to true.
 * @func startScraping - Call to the function that initiates the scrapping. Receives as argument the title of the movie.
 * @property {Object} scrappingCritics - The reviews obtained in the scraped. Value of property is an Array.
 * @property {Object} categories - It contains the properties and values ​​of the movie from the api but correcting the bad practice in the naming of the properties without camel case.
 * @func pushApiMovieInMongo - Call to the function that saves the movie from the api plus the scrapping reviews in mongo
 * @property {Object} categories - The values send to render.
 * @property {string} Title - The value of the title property is passed to lower case to unify searches once it is saved in mongo
 * @property {Array} exclude - Array with the categories that the pug loop should not render.
 * @property {boolean} admin - Informs the renderer if it is a user or an administrator so that it displays the corresponding navigation bar.
 * @property {boolean} noMovie - Tells the renderer of the search view to use the pug template for movie not found.
 * @property {function} res.render - Rendering of the response with the movie in the search view.
 * @throws {Error} message with the error during the search process
 */

const getSearchForTitle = async (req, res) => {
    try {
        const resp = await fetch(`http://www.omdbapi.com/?t=${req.params.title}&apikey=` + API_KEY);
        const categoriesMovie = await resp.json();
        if (categoriesMovie.Error != 'Movie not found!') {
            console.log("FIND MOVIE IN API");
            const scrapingCritics = { "critics": await startScraping(categoriesMovie.Title) }
            const categories = {};
            Object
                .keys(categoriesMovie)
                .map((_, i, arrOfKeys) => arrOfKeys[i] == 'Title' ? categories[arrOfKeys[i].toLowerCase()] = categoriesMovie[arrOfKeys[i]].toLowerCase() : categories[arrOfKeys[i].toLowerCase()] = categoriesMovie[arrOfKeys[i]]);
            // Mongo Saves movie and scraping
            pushApiMovieInMongo({ ...categories, ...scrapingCritics });
            res.status(200).render("search", { categories: { ...categories, ...scrapingCritics }, excludes: ['rated', 'released', 'writer', 'awards', 'ratings', 'metascore', 'imdbrating', 'imdbvotes', 'imdbid', 'type', 'dvd', 'boxoffice', 'production', 'response', 'website', 'poster', 'critics', 'poster', 'country'],  admin: req.decoded.admin });
        } else {
            res.render("search", { noMovie: true,  admin: req.decoded.admin });
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