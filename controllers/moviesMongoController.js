/**
 * @author Javier Fuertes, Gabriela García y Pablo Mateos 
 * @exports moviesAdmin
 * @namespace MongoControllers
 */

const Movies = require('../models/moviesMongo')
/**
 * Description: This function gets all the movies in the database.
 * @memberof MongoControllers
 * @method getMovies
 * @async 
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @return {Object} movies in the database
 * @throws {err} message with the error.
 */

const getMovies = async (req, res) => {
    try {
        let movies = await Movies.find({ Movies }, { _id: 0, __v: 0 });
        res.status(200).render("moviesAdmin", { allMovies: movies });
    }
    catch (err) {
        res.status(400).json({ msj: err.message });
    };
};

/**
 * Description: This function renders the create movie view
 * @memberof Renders
 * @method  createMovie
 * @async 
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @throws {err} message with the error.
 */

const getFormMovie = (req, res) => {
    try {
        res.render('createMovie');
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

/**
 * Description: This function creates a movie in the database.
 * @memberof MongoControllers
 * @method createMovie
 * @async 
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @return {Object} JSON, message indicating that the movie was successfully added to the database.
 * @throws {err} message with the error.
 */

const createMovie = async (req, res) => {
    const newMovie = req.body;
    try {
        let response = await new Movies(newMovie);
        let answer = await response.save();
        res.status(201).json({ msj: `New movie added to DB.`, movie: answer });
    } catch (err) {
        res.status(400).json({ msj: err.message })
    }
};
/**
 * Description: This function deletes a movie in the database.
 * @memberof MongoControllers
 * @method deleteMovie
 * @async 
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @return {Object} JSON, message indicating that the movie was successfully deleted to the database.
 * @throws {err} message with the error.
 */
const deleteMovie = async (req, res) => {
    try {
        let answer = await Movies.findOneAndDelete({ title: req.query.title });
        res.status(200).json({ "msj": `Has eliminado la pelicula: ${answer.title}, de la base de datos` });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

/**
 * Description: This function renders the update movie view
 * @memberof Renders
 * @method  updateMovie
 * @async 
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @throws {err} message with the error.
 */


const formUpdateMovie = (req, res) => {
    try {
        res.render('updateMovie');
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};
/**
 * Description: This function updates a movie in the database.
 * @memberof MongoControllers
 * @method updateMovie
 * @async 
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @return {Object} JSON, message indicating that the movie was successfully updated to the database.
 * @throws {err} message with the error.
 */
const updateMovie = async (req, res) => {
    const { img, title, year, director, genre, runtime, plot, actors, language } = req.body
    try {
        const movieUpdate = await Movies.findOneAndUpdate({ title }, { img, year, director, genre, runtime, plot, actors, language });
        await movieUpdate.save();
        res.status(201).json({ msj: `La pelicula ${title} ha sido actualizado.`, movie: movieUpdate });
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