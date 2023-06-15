/**
 * @author Pablo Mateos
 * @version 2.0
 * @namespace logoutControllers
 */


/**
 * Description: This function renders the home view
 * @memberof logoutControllers
 * @method  logout
 * @async 
 * @param {Object} res - HTTP response.
 * @property {function} res.clearCookie - destroy cookie whit the token
 * @property {function} res.clearCookie.redirect - Redirected of the response to the home path.
 * @throws {Error} message with the error if destruction of cookie fail.
 */


const logout = (_, res) => {
    try {
        res.clearCookie("token").redirect("/");
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};

module.exports = {
    logout
}