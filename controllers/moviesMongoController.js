/**
 * @author Pablo Mateos
 * @version 2.0
 * @namespace MongoControllers
 */

const Movies = require('../models/moviesMongo')
/**
 * Description: This function gets all the movies in the database.
 * @memberof ControllersBackend
 * @method getMovies
 * @async 
 * @param {Object} Movies - schema of Movies mongo
 * @param {Array} movies - All movies mongo conteins
 * @param {Object} res - HTTP response whit the movies to render on moviesAdmin view
 * @throws {err} message with the error.
 */

const getMovies = async (req, res) => {
    try {
        let movies = await Movies.find({ Movies }, { _id: 0, __v: 0 });
        res.status(200).render("moviesAdmin", { allMovies: movies.reverse() });
    }
    catch (err) {
        res.status(400).json({ msj: err.message });
    };
};

/**
 * Description: Render a form on the view createMovie to create a movie.
 * @memberof ControllersBackend
 * @method  getFormMovie
 * @async 
 * @param {Object} res - HTTP response to render the form
 * @param {string} idValue - String to assing name of ids because the render is a multi-rendered template
 * @param {null} titleUpdate - This value is null to render the correct fragment of pug 
 * @throws {err} message with the error.
 */

const getFormMovie = (req, res) => {
    try {
        res.render('createMovie', { idValue: "createMovie", titleUpdate: null });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

/**
 * Description: This function creates a movie in the database.
 * @memberof ControllersBackend
 * @method createMovie
 * @async 
 * @param {Object} req.body - Movie values to send mongo to create a movie
 * @param {Object} answer - Response of the attempt to save the movie in mongo
 * @param {Object} res - HTTP response of the response of mongo
 * @throws {err} - JSON, message with the error. See in your tool REST
 */

const createMovie = async (req, res) => {
    try {
        let response = await new Movies(req.body);
        let answer = await response.save();
        res.status(201).json({ "msj": `The movie with title ${answer.title} has been added to mongodb`, movie: answer });
    } catch (err) {
        res.status(400).json({ msj: err.message })
    }
};
/**
 * Description: This function deletes a movie in the database.
 * @memberof ControllersBackend
 * @method deleteMovie
 * @async 
 * @param {string} req.query.title - Movie title to remove
 * @param {Object} answer - Response of the attempt to delete the movie in mongo
 * @param {Object} res - HTTP response of the response of mongo
 * @throws {err} - JSON, message with the error. See in your tool REST
 */
const deleteMovie = async (req, res) => {
    try {
        let answer = await Movies.findOneAndDelete({ title: req.query.title });
        res.status(200).json({ "msj": `You have removed the movie: ${answer.title}, from the data base` });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

/**
 * Description: Render a form on the view update to update a movie.
 * @memberof ControllersBackend
 * @method formUpdateMovie
 * @async 
 * @param {Object} res - HTTP response to Render the form
 * @param {string} idValue - String to assing name of ids because the render is a multi-rendered template
 * @param {null} titleUpdate - This value prevents the rendering of the input title in the multi-rendered template, because the title is not updateable. 
 * @throws {err} message with the error.
 */


const formUpdateMovie = (req, res) => {
    try {
        res.render('updateMovie', { idValue: "updateMovie", titleUpdate: "Title" });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};
/**
 * Description: This function updates a movie in the database.
 * @memberof ControllersBackend
 * @method updateMovie
 * @async 
 * @param {Object} req.body - All the values ​​that will be set in the update and the value (title) to find the movie in mongo
 * @param {Object} answer - Response of the attempt to update the movie in mongo
 * @param {Object} res - HTTP response of the response of mongo
 * @throws {err} - JSON, message with the error. See in your tool REST
 */
const updateMovie = async (req, res) => {
    try {
        const { poster, title, year, director, genre, runtime, plot, actors, language } = req.body;
        const response = await Movies.findOneAndUpdate({ title }, { poster, year, director, genre, runtime, plot, actors, language });
        let answer = await response.save();
        res.status(201).json({ msj: `The movie: ${answer.title}, has been updated`, movie: answer });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

module.exports = {
    getMovies,
    createMovie,
    deleteMovie,
    formUpdateMovie,
    updateMovie,
    getFormMovie
}