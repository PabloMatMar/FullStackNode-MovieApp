const token = require('../middleware/checkToken').token;

/**
 * Description: This function renders the home view
 * @memberof Renders
 * @method  getHome
 * @async 
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 */

// res.status(200).render("searchTitle", { param, critics });
const getHome = (req, res) => req.cookies.token == undefined ? res.render("home", { user: false }) : res.render("home", { user: true });


module.exports = {
    getHome
}