/**
 * @author Pablo Mateos
 * @version 2.0
 * @namespace moviesMongoControllers
 */

const Movies = require('../models/moviesMongo')
/**
 * Description: This function gets all the movies in the database.
 * @memberof moviesMongoControllers
 * @method getMovies
 * @async 
 * @param {Object} res - HTTP response.
 * @property {Object} Movies - schema of Movies mongo.
 * @property {Array} movies - All movies mongo conteins.
 * @property {Array} allMovies - Conteins the allMovies to rendering in a templeate.
 * @property {function} res.render  Rendering of the response in the moviesAdmin.
 * @throws {Error} message with the error.
 */

const getMovies = async (req, res) => {
    try {
        const movies = await Movies.find({ Movies }, { _id: 0, __v: 0 });
        res.status(200).render("moviesAdmin", { allMovies: movies.reverse(), admin: req.decoded.admin, nickName: req.decoded.user });
    }
    catch (err) {
        res.status(400).json({ msj: err.message });
    };
};

/**
 * Description: Render a form on the view createMovie to create a movie.
 * @memberof moviesMongoControllers
 * @method getFormMovie
 * @async 
 * @param {Object} res - HTTP response to render the form
 * @property {string} idValue - String to assing name of ids because the render is a multi-rendered template
 * @property {null} titleUpdate - This value is null to render the correct fragment of pug.
 * @property {boolean} admin - Informs the renderer if it is a user or an administrator so that it displays the corresponding navigation bar.
 * @property {string} nickName - The username/administrator for rendering.
 * @property {function} res.render - Rendering of the response in the createMovie view.
 * @throws {Error} message with the error.
 */

const getFormMovie = (req, res) => {
    try {
        res.render('createMovie', { idValue: "createMovie", titleUpdate: null, admin: req.decoded.admin, nickName: req.decoded.user });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

/**
 * Description: This function creates a movie in the database.
 * @memberof moviesMongoControllers
 * @method createMovie
 * @async 
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @property {function} Movies - Method that caugt mongo schema to insert a movie in mongo.
 * @property {Object} req.body - Movie values to send mongo to create a movie
 * @property {function} save - The method to save the movie in mongo.
 * @property {Object} answer - Response of the attempt to save the movie in mongo
 * @property {object} movie - Conteins the values of the movie that was created. 
 * @property {function} res.json - Formatting the response to JSON whit the message `The movie with title ${answer.title} has been added to mongodb` and the object to contains the new movie.
 * @throws {Error} - JSON, message with the error. See in your tool REST
 */

const createMovie = async (req, res) => {
    try {
        const response = await new Movies(req.body);
        const answer = await response.save();
        res.status(201).json({ "msj": `The movie with title ${answer.title} has been added to mongodb`, movie: answer });
    } catch (err) {
        res.status(400).json({ msj: err.message })
    }
};
/**
 * Description: This function deletes a movie in the database.
 * @memberof moviesMongoControllers
 * @method deleteMovie
 * @async 
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @property {Object} Movies - Mongo schema
 * @property {function} findOneAndDelete - Method to search in mongo a movie for title and deleted it. 
 * @property {string} req.query.title - Movie title to remove
 * @property {Object} answer - Response of the attempt to delete the movie in mongo
 * @property {function} res.json - Formatting the response to JSON whit the message `You have removed the movie: ${answer.title}, from the data base`.
 * @throws {Error} - JSON, message with the error. See in your tool REST
 */
const deleteMovie = async (req, res) => {
    try {
        const answer = await Movies.findOneAndDelete({ title: req.query.title });
        res.status(200).json({ "msj": `You have removed the movie: ${answer.title}, from the data base` });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

/**
 * Description: Render a form on the view update to update a movie.
 * @memberof moviesMongoControllers
 * @method formUpdateMovie
 * @async 
 * @param {Object} res - HTTP response to Render the form
 * @property {string} idValue - String to assing name of ids because the render is a multi-rendered template
 * @property {null} titleUpdate - This value prevents the rendering of the input title in the multi-rendered template, because the title is not updateable.
 * @property {boolean} admin - Informs the renderer if it is a user or an administrator so that it displays the corresponding navigation bar.
 * @property {string} nickName - The username/administrator for rendering.
 * @property {function} res.render  Rendering of the response in the updateMovie view.
 * @throws {Error} message with the error.
 */


const formUpdateMovie = (req, res) => {
    try {
        res.render('updateMovie', { idValue: "updateMovie", titleUpdate: "Title", admin: req.decoded.admin, nickName: req.decoded.user });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};
/**
 * Description: This function updates a movie in the database.
 * @memberof moviesMongoControllers
 * @method updateMovie
 * @async 
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @property {Object} req.body - All the values ​​that will be set in the update and the value of field (title) to find the movie in mongo
 * @property {function} findOneAndUpdate - Method to search in mongo a movie for title and updated it. 
 * @property {function} save - The method to save the updated movie in mongo.
 * @property {Object} answer - Response of the attempt to update the movie in mongo.
 * @property {object} movie - Conteins the values of the movie that was updated.
 * @property {function} res.json - Formatting the response to JSON whit the message `The movie: ${answer.title}, has been updated` and the object to contains the updated movie.
 * @throws {Error} - JSON, message with the error. See in your tool REST
 */
const updateMovie = async (req, res) => {
    try {
        const { poster, title, year, director, genre, runtime, plot, actors, language } = req.body;
        const response = await Movies.findOneAndUpdate({ title }, { poster, year, director, genre, runtime, plot, actors, language });
        const answer = await response.save();
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