const Movies = require('../models/moviesMongo')

/**
 * Description: This function renders the update movie view
 * @memberof Renders
 * @method  updateMovie
 * @async 
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 */


const formUpdateMovie = (req, res) => res.render('updateMovie');
/**
 * Description: This function updates a movie in the database.
 * @memberof MongoControllers
 * @method updateMovie
 * @async 
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @return {Object} JSON, message indicating that the movie was successfully updated to the database.
 * @throws {Error} message with the error.
 */
const updateMovie = async (req, res) => {

    const { img, title, year, director, genre, runtime, plot, actors, language } = req.body;
    try {
        const movieUpdate = await Movies.findOneAndUpdate({ title }, { img, year, director, genre, runtime, plot, actors, language });
        await movieUpdate.save();
        res.status(201).json({
            msj: `La pelicula ${title} ha sido actualizado.`,
            movie: movieUpdate
        })
    } catch (err) {
        res.status(400).json({ msj: err.message });
    }

}

module.exports = {
    formUpdateMovie,
    updateMovie
}