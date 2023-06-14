/**
 * @author Pablo Mateos
 * @version 2.0
 * @namespace homeControllers
 */

const token = require('../middleware/checkToken').token;

/**
 * Description: This function renders the home view
 * @memberof ControllersBackend
 * @method  getHome
 * @async 
 * @param {string} req.cookies.token - token of user
 * @param {Object} res - HTTP response to render view home
 * @throws {Error} message with the error if render fails.
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