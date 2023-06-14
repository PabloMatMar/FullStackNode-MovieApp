/**
 * @author Pablo Mateos
 * @version 2.0
 * @namespace ControllersBackend
 */

const process = require('process');
const users = require('../models/users_sql')
jwt = require('jsonwebtoken');
require('dotenv').config();
const { SECRET } = process.env;


/**
 * Description: This function save a favorite movie of user in the database.
 * @memberof ControllersBackend
 * @method addFavorite
 * @async  
 * @param {Object} req.body - The values ​​to enter in SQL
 * @param {string} req.decoded.user - The name of user that is forenkey in SQL
 * @param {Object} res - message "The movie was add" if process was succesful.
 * @throws {Error} message with the err during save process.
 */
const addFavorite = async (req, res) => {
    try {
        await users.addFavorite(req.body, req.decoded.user);
        res.status(201).json({ msj: "The movie was add" });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

/**
 * Description: This function get all favorites movies of user in the database.
 * @memberof ControllersBackend
 * @method getFavorites
 * @async  
 * @param {function} deleteFavorite - Calls the function in charge of using the queries to obtein all the favorites movies of the user.
 * @param {string} req.decoded.user - The username that acts as the forenkey in the SQL favorites table.
 * @param {Array} userFavMovies - SQL return with all the user's favorite movies.
 * @param {Object} res - HTTP response whit the favs movies to render on search view
 * @throws {Error} message with the error during the fetch process.
 */

const getFavorites = async (req, res) => {
    try {
        const userFavMovies = await users.getFavorites(req.decoded.user);
        res.status(200).render("search", { userFavMovies: userFavMovies.reverse() });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

/**
 * Description: This function get all favorites movies of user in the database.
 * @memberof ControllersBackend
 * @method deleteFavoriteMovie
 * @async  
 * @param {function} deleteFavorite - Calls the function in charge of using the queries to eliminate the movie.
 * @param {string} req.decoded.user - The username that acts as the forenkey in the SQL favorites table.
 * @param {string} req.body.title - The username that will be used in the where clause of the query
 * @param {Array} userFavMovies - SQL return with all the user's favorite movies.
 * @param {Object} res - message "The movie was delete" if process was succesful.
 * @throws {Error} message with the error during the delete process.
 */

const deleteFavoriteMovie = async (req, res) => {
    try {
        await users.deleteFavorite(req.decoded.user, req.body.title);
        res.status(200).json({ msj: "The movie was delete" });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

/**
 * Description: This calls the function that created one user and, in case of success, creates the token for the user's navigation.
 * @memberof ControllersBackend
 * @method createUSer
 * @async 
 * @param {function} createUser - Call to the function in charge of using the queries to create a new user row in the users table.
 * @param {number} response - The value is one if the user wascreated, else, 0.
 * @param {Object} req.body - The username, the password, and the boolean admin-user.
 * @param {Object} payload - The user information that will be on the server side.
 * @param {string} SECRET - The key to sing the token.
 * @param {string} req.body.emailSignup - The unique username. 
 * @param {Object} res.cookie - HTTP response to save the token in the cookie and redirect to the home view.
 * @param {boolean} login - Boolean that informs the pug template to allow the form to be rendered.
 * @param {boolean} alreadyExist - Boolean that informs the pug template to allow the message "User already Exisst" to be rendered.
 * @param {Object} res.render - HTTP response to render home with the login form and the message "User does not exist"
 * @throws {Error} message with the error during the delete process.
 */

const createUser = async (req, res) => {
    try {
        const response = await users.createUser(req.body);
        if (response == 1) {
            const payload = {
                check: true,
                user: req.body.emailSignup/*,
                admin: req.body.admin*/
            };
            const token = jwt.sign(payload, SECRET, {
                expiresIn: "3000000ms" // 30 minutos hasta que expira
            });
            //Almacenamos el token en las cookies
            res.cookie('token', token).status(200).redirect("/");
        } else {
            res.render("home", { singup: true, alreadyExist: true });
        }
    } catch (err) {
        console.log("ERRORRRR");
        res.status(403).json({ msj: err.message })
    };
};

/**
 * Description: This calls the function that validated the credential of user and, in case of success, creates the token for the user's navigation.
 * @memberof ControllersBackend
 * @method validateUser
 * @async 
 * @param {function} validatedUser - Call to the function in charge of using the queries to validate the login credentials.
 * @param {number} response - The value is one if the validation of the credential was okey, else, 0.
 * @param {Object} req.body - The username, the password, and the boolean admin-user.
 * @param {Object} payload - The user information that will be on the server side.
 * @param {string} SECRET - The key to sing the token.
 * @param {string} req.body.emailSignup - The unique username. 
 * @param {Object} res.cookie - HTTP response to save the token in the cookie and redirect to the home view.
 * @param {boolean} login - Boolean that informs the pug template to allow the form to be rendered.
 * @param {boolean} incorrectUser - Boolean that informs the pug template to allow the message "User does not exist" to be rendered.
 * @param {Object} res.render - HTTP response to render home with the login form and the message "User does not exist"
 * @throws {Error} message with the error during the delete process.
 */

const validatedUser = async (req, res) => {
    try {
        const response = await users.validatedUser(req.body);
        if (response == 1) {
            const payload = {
                check: true,
                user: req.body.email/*,
                admin: req.body.admin*/
            };
            const token = jwt.sign(payload, SECRET, {
                expiresIn: "12000000ms" // 1200 segundos para que expire
            });
            //Almacenamos el token en las cookies
            res.cookie('token', token).status(200).redirect("/");
        } else
            res.render("home", { login: true, incorrectUser: true })
    } catch (err) {
        res.status(401).json({ msj: err.message })
    };
};

/**
 * Description: This function renders the home view whit the form to login.
 * @memberof ControllersBackend
 * @method  getLogin
 * @async 
 * @param {boolean} login - Boolean that informs the pug template to allow the form to be rendered.
 * @param {Object} res - HTTP response to render the view home whit the form of login.
 * @throws {Error} message with the error if render fail.
 */

const getLogin = (_, res) => {
    try {
        res.render('home', { login: true });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

/**
 * Description: This function renders the home view whit the form to singup.
 * @memberof ControllersBackend
 * @method  getSingup
 * @async 
 * @param {boolean} singup - Boolean that informs the pug template to allow the form to be rendered.
 * @param {Object} res - HTTP response to render the view home whit the form of login.
 * @throws {Error} message with the error if render fail.
 */

const getSingup = (_, res) => {
    try {
        res.render('home', { singup: true });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};



module.exports = {
    addFavorite,
    getFavorites,
    deleteFavoriteMovie,
    getLogin,
    getSingup,
    createUser,
    validatedUser
}