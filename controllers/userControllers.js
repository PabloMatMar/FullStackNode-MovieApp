/**
 * @author Pablo Mateos
 * @version 2.0
 * @namespace userControllers
 */
require('dotenv').config();
const { SECRET } = process.env;
const bcrypt = require('bcrypt');
const users = require('../models/users_sql');
const jwt = require('jsonwebtoken');


/**
 * Description: This function save a favorite movie of user in the database.
 * @memberof userControllers
 * @method addFavorite
 * @async  
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @property {Object} req.body - The values ​​to enter in SQL
 * @property {string} req.decoded.user - The name of user that is forenkey in SQL
 * @property {function} res.json - Formatting the response to JSON whit the message "The movie was adds"
 * @throws {Error} message with the err during save process.
 */
const addFavorite = async (req, res) => {
    try {
        await users.addFavorite(req.body, req.decoded.user);
        res.status(201).json({ msj: "The movie was adds" });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

/**
 * Description: This function get all favorites movies of user in the database.
 * @memberof userControllers
 * @method getFavorites
 * @async  
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @property {function} getFavorites - Calls the function in charge of using the queries to obtein all the favorites movies of the user.
 * @property {string} req.decoded.user - The username that acts as the forenkey in the SQL favorites table.
 * @property {string} path - path in which the form post will be practiced.
 * @property {string} movieOrFavMovie - Text that informs where the form will search for the movie. It can be in favorites or a search in the apis. 
 * @property {Array} userFavMovies - SQL return with all the user's favorite movies.
 * @property {string} nickName - The username/administrator for rendering.
 * @property {string} avatar - The user avatar image url for rendering.
 * @property {function}  res.render - Rendering of the response with the user's favorite movies in the search view.
 * @throws {Error} message with the error during the fetch process.
 */

const getFavorites = async (req, res) => {
    try {
        const userFavMovies = await users.getFavorites(req.decoded.user);
        let path, whatSearch;
        userFavMovies.length == 0 ? (path = "/search", whatSearch = "Write the full title of the movie/serie:") : (path = "/favmovies/specific/", whatSearch = "Search among your favorites:");
        res.status(200).render("search", { path: path, movieOrFavMovie: whatSearch, userFavMovies: userFavMovies.reverse(), nickName: req.decoded.user, avatar: req.decoded.avatar });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

const capturingFormData = async (req, res) => {
    try {
        let title = " "
        if (req.body.title.length > 0) {
            title = req.body.title.toLowerCase().trim();
            title = title[0].toUpperCase().concat(title.slice(1));
        };
        res.redirect("/favmovies/: " + title);
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};

const getASpecificFavorite = async (req, res) => {
    try {
        const title = req.params.title.slice(1);
        const specificMovie = await users.getFavorites(req.decoded.user, title);
        let notFound, status;
        specificMovie.length == 0 ? (status = 302, notFound = "That movie is not among your favorites.") : (status = 404, notFound = null);
        res.status(status).render("search", { path: "/favmovies/specific/", movieOrFavMovie: "Search among your favorites:", userFavMovies: specificMovie, notFound, title: title.slice(1), nickName: req.decoded.user, avatar: req.decoded.avatar });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

/**
 * Description: This function get all favorites movies of user in the database.
 * @memberof userControllers
 * @method deleteFavoriteMovie
 * @async  
 * @param {Object} req - HTTP request.
 * @param {Object} res - HTTP response.
 * @property {function} deleteFavorite - Calls the function in charge of using the queries to eliminate the movie.
 * @property {string} req.decoded.user - The username that acts as the forenkey in the SQL favorites table.
 * @property {string} req.body.title - The username that will be used in the where clause of the query.
 * @property {function} res.json - Formatting the response to JSON whit the message "The movie was delete"
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
 * @memberof userControllers
 * @method createUSer
 * @async 
 * @param {Object} req - HTTP request.
 * @param {Object} res - HTTP response.
 * @property {function} createUser - Call to the function in charge of using the queries to create a new user row in the users table.
 * @property {number} response - The value is one if the user wascreated, else, 0.
 * @property {Object} req.body - The username, the password, the boolean admin-user and the avatar of user.
 * @property {Object} payload - The user information that will be on the server side.
 * @property {string} SECRET - The key to sing the token.
 * @property {string} req.body.emailSignup - The unique username. 
 * @property {function} res.cookie - HTTP response to save the token in the cookie and redirect to the home view.
 * @property {boolean} login - Boolean that informs the pug template to allow the login form to be rendered.
 * @property {boolean} alreadyExist - Boolean that informs the pug template to allow the message "User already Exisst" to be rendered.
 * @property {function} res.render - Rendering of the response in the home view with the login form and the message "User does not exist".
 * @throws {Error} message with the error during the delete process.
 */

const createUser = async (req, res) => {
    try {
        const saltRounds = 10;
        req.body.passwordSignup = await bcrypt.hash(req.body.passwordSignup, saltRounds);
        const response = await users.createUser(req.body);
        if (response == 1) {
            const payload = {
                check: true,
                user: req.body.emailSignup.toLowerCase(),
                avatar: req.body.avatar,
                admin: req.body.admin
            };
            const token = jwt.sign(payload, SECRET, {
                expiresIn: "3000000ms" // 30 minutos hasta que expira
            });
            res.cookie('token', token).status(200).redirect("/");
        } else {
            res.render("home", { singup: true, alreadyExist: true });
        }
    } catch (err) {
        res.status(403).json({ msj: err.message })
    };
};

/**
 * Description: This calls the function that validated the credential of user and, in case of success, creates the token for the user's navigation.
 * @memberof userControllers
 * @method validateUser
 * @async 
 * @param {Object} req - HTTP request.
 * @param {Object} res - HTTP response.
 * @property {string} req.body.email - The unique username.
 * @property {string} req.body.password - The password of user.
 * @property {function} validatedUser - Call to the function (two arguments, email and password) in charge of using the queries to validate the login credentials.
 * @property {number} response - The value is one if the validation of the credential was okey, else, 0.
 * @property {Object} payload - The user information that will be on the server side.
 * @property {string} SECRET - The key to sing the token.
 * @property {function} res.cookie - HTTP response to save the token in the cookie and redirect to the home view.
 * @property {boolean} login - Boolean that informs the pug template to allow the form to be rendered.
 * @property {boolean} incorrectUser - Boolean that informs the pug template to allow the message "User does not exist" to be rendered.
 * @property {function} res.render - Rendering of the response in the home view with the login form and the message "User does not exist"
 * @throws {Error} message with the error during the delete process.
 */

const validatedUser = async (req, res) => {
    try {
        const { credential, admin, avatar } = await users.validatedUser(req.body.email.toLowerCase(), req.body.password);
        if (credential == 1) {
            const payload = {
                check: true,
                user: req.body.email.toLowerCase(),
                avatar: avatar,
                admin: admin
            };
            const token = jwt.sign(payload, SECRET, {
                expiresIn: "12000000ms"
            });
            let path, status;
            req.body.avatarChanged ? (status = 307, path = "/user") : (status = 200, path = "/");
            res.cookie('token', token).status(status).redirect(path);
        } else
            res.render("home", { login: true, incorrectUser: true });
    } catch (err) {
        res.status(401).json({ msj: err.message })
    };
};

/**
 * Description: This function renders the home view whit the form to login.
 * @memberof userControllers
 * @method  getLogin
 * @async 
 * @param {Object} res - HTTP response.
 * @property {boolean} login - Boolean that informs the pug template to allow the form to be rendered.
 * @property {function} res.render - Rendering of the response in the home view whit the form of login.
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
 * @memberof userControllers
 * @method  getSingup
 * @async 
 * @param {Object} res - HTTP response.
 * @property {string} req.params.errSignup - A stringified array containing error information on the character constraint singup attempt. If params is empty, the log view is rendered without error reporting.
 * @property {boolean} singup - Boolean that informs the pug template to allow the form to be rendered.
 * @property {Array} errSignup - Contains information about any error produced in the character requirement for singup. The array consists of three binary elements, 1 corresponds to error, 0 is no error, each is read in the pug template to inform the user on rendering.
 * @property {function} res.render - Rendering of the response in the home view whit the form of login.
 * @throws {Error} message with the error if render fail.
 */

const getSingup = (req, res) => {
    try {
        req.params.errSignup == ':' ? res.render('home', { singup: true }) : res.render('home', { singup: true, errSignup: JSON.parse(req.params.errSignup.slice(1)) });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};


const renderUserView = (req, res) => {
    try {
        res.render("user", { nickName: req.decoded.user, avatar: req.decoded.avatar })
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

const renderFormUpdtAvatar = (req, res) => {
    try {
        req.params.errForm == ':' ? res.render("user", { updtAvatar: true, nickName: req.decoded.user, avatar: req.decoded.avatar }) : res.render("user", { updtAvatar: true, errsForm: JSON.parse(req.params.errForm.slice(1)), nickName: req.decoded.user, avatar: req.decoded.avatar })
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

const renderFormUpdtPassword = (req, res) => {
    try {
        req.params.errForm == ':' ? res.render("user", { updtPassword: true, nickName: req.decoded.user, avatar: req.decoded.avatar }) : res.render("user", { updtPassword: true, errsForm: JSON.parse(req.params.errForm.slice(1)), nickName: req.decoded.user, avatar: req.decoded.avatar })
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

const changesAvatar = async (req, res) => {
    try {
        const response = await users.changesAvatar(req.decoded.user, req.body.avatar, req.body.password);
        if (response.rowCount == 1) {
            req.body.email = req.decoded.user;
            req.body.avatarChanged = true;
            await validatedUser(req, res);
        } else
            res.render("user", { updtAvatar: true, passwordError: true, nickName: req.decoded.user, avatar: req.decoded.avatar });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

const changesPassword = async (req, res) => {
    try {
        const saltRounds = 12;
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        const response = await users.changesPassword(req.decoded.user, req.body.password, req.body.oldPassword);
        response == 1 ? res.render("user", { updtPasswordWasOk: true, nickName: req.decoded.user, avatar: req.decoded.avatar }) : res.render("user", { updtPassword: true, passwordError: true, nickName: req.decoded.user, avatar: req.decoded.avatar });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};


module.exports = {
    addFavorite,
    getFavorites,
    capturingFormData,
    getASpecificFavorite,
    deleteFavoriteMovie,
    getLogin,
    getSingup,
    createUser,
    validatedUser,
    changesAvatar,
    changesPassword,
    renderUserView,
    renderFormUpdtAvatar,
    renderFormUpdtPassword
}