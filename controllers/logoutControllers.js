/**
 * @author Pablo Mateos
 * @version 2.0
 * @namespace logoutControllers
 */


/**
 * Description: This function renders the home view
 * @memberof ControllersBackend
 * @method  logout
 * @async 
 * @param {Object} res - destroy cookie whit the token
 * @throws {Error} message with the error if destruction of cookie fail.
 */


const logout = (req, res) => {
    try {
        res.clearCookie("token").redirect("/");
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};

module.exports = {
    logout
}