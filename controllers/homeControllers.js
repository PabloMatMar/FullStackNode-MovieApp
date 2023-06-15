/**
 * @author Pablo Mateos
 * @version 2.0
 * @namespace homeControllers
 */

/**
 * Description: This function renders the home view
 * @memberof homeControllers
 * @method  getHome
 * @async 
 * @param {Object} req - HTTP request.
 * @param {Object} res - HTTP response.
 * @property {string} req.cookies.token - token of user
 * @property {boolean} user - Boolean that informs the pug template to allow the anchors to login/singup to be rendered.
 * @property {function} res.render - Rendering of the response in the home view with the login.
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