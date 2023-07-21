/**
 * @author Pablo Mateos
 * @version 2.0
 * @namespace homeControllers
 */

/**
 * Description: This function renders the home view
 * @memberof homeControllers
 * @method  getHome
 * @param {Object} req - HTTP request.
 * @param {Object} res - HTTP response.
 * @property {string} req.cookies.token - token of user.
 * @property {string} payload - User information extracted from the token for the rendering of the avatar and the name of the user.
 * @property {string} message - Messages with user update information from req.params.messageToUsers.
 * @property {boolean} admin - Boolean that informs the pug template to allow the anchors to login/singup to be rendered.
 * @property {string} nickName - The username/administrator for rendering.
 * @property {string} avatar - The user avatar image url for rendering.
 * @property {function} res.render - Rendering of the response in the home view with the login.
 * @throws {Error} message with the error if render fails.
 */

const getHome = (req, res) => {
    try {
        let messageToUsers, payload;
        req.params.messageToUsers == ':' ?
            messageToUsers = false : messageToUsers = req.params.messageToUsers.slice(1);
        if (req.cookies.token) {
            payload = JSON.parse(Buffer.from(req.cookies.token.split('.')[1], 'base64').toString());
            res.render("home", { logged: true, message: messageToUsers, admin: payload.admin, nickName: payload.user, avatar: payload.avatar })
        } else
            res.render("home");
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};


/**
 * Description: This function renders the home view whit empty path.
 * @memberof homeControllers
 * @method  init
 * @param {Object} req - HTTP request.
 * @param {Object} res - HTTP response.
 * @property {function} res.render - Rendering of the response in the home view.
 * @throws {Error} message with the error if render fails.
 */
const init = (_, res) => {
    try {
        res.render("home");
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};


module.exports = {
    getHome,
    init
}