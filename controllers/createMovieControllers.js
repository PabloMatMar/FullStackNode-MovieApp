/**
 * @author Javier Fuertes, Gabriela García y Pablo Mateos 
 * @exports createMovie
 * @namespace Renders
 */

/**
 * Description: This function renders the create movie view
 * @memberof Renders
 * @method  createMovie
 * @async 
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @throws {Err} message with the error if render fails.
 */

const createMovie = (req, res) => {
    try {
        res.render('createMovie');  
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};

module.exports = {
    createMovie
}