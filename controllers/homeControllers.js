const token = require('../middleware/checkToken').token;

/**
 * Description: This function renders the home view
 * @memberof Renders
 * @method  getHome
 * @async 
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @throws {Err} message with the error if render fails.
 */

const getHome = (req, res) => {
    try {
        req.cookies.token == undefined ? res.render("home", { user: false }) : res.render("home", { user: true });
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};


module.exports = {
    getHome
}