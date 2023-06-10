/**
 * Description: This function renders the dashboard view
 * @memberof Renders
 * @method  getDashboard
 * @async 
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @throws {Err} message with the error if render fails.
 */
const getDashboard = (req, res) => {
    try {
        res.render('dashboard');
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};

module.exports = {
    getDashboard
}