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
 * @property {boolean} admin - Boolean that informs the pug template to allow the anchors to login/singup to be rendered.
 * @property {string} nickName - The username/administrator for rendering.
 * @property {string} avatar - The user avatar image url for rendering.
 * @property {function} res.render - Rendering of the response in the home view with the login.
 * @throws {Error} message with the error if render fails.
 */

const getHome = (req, res) => {
    try {
        let admin;
        req.cookies.token ?
            (admin = JSON.parse(Buffer.from(req.cookies.token.split('.')[1], 'base64').toString()).admin, res.render("home", { logged: true, admin: admin, nickName: JSON.parse(Buffer.from(req.cookies.token.split('.')[1], 'base64').toString()).user, avatar: JSON.parse(Buffer.from(req.cookies.token.split('.')[1], 'base64').toString()).avatar }))
            : res.render("home");
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};


module.exports = {
    getHome
}