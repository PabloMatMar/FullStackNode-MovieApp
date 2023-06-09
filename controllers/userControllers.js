/**
 * @author Javier Fuertes, Gabriela García y Pablo Mateos 
 * @exports userControllers
 * @namespace userControllers
 */

const process = require('process');
const users = require('../models/users_sql')
jwt = require('jsonwebtoken');
require('dotenv').config();
const { SECRET } = process.env
const token = require('../middleware/checkToken').token;


/**
 * Description: This function save a favorite movie of user in the database.
 * @memberof userControllers
 * @method addFavorite
 * @async  
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @return {Object} - an object containing the scraped info.
 * @throws {Error} message with the error during save process.
 */
const addFavorite = async (req, res) => {
    try {
        const response = await users.addFavorite(req.body, req.decoded.user);
        res.status(201).json({
            msg: response
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};



/**
 * Description: This function get all favorites movies of user in the database.
 * @memberof userControllers
 * @method getFavorites
 * @async  
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @desc {Error} Obtain a user's favorites movies from both the API and MongoDB
 */

const getFavorites = async (req, res) => {
    try {
        // let userData = req.oidc.user
        // let userId = userData.sub
        // if (userId.startsWith('auth0|')) {
        //     console.log(userId.slice(userId.indexOf('|') + 1))
        //     userId = userId.slice(userId.indexOf('|') + 1)
        // }

        const userMoviesApi = await users.getFavorites(req.decoded.user);

        res.status(200).render("moviesUser", { favMoviesApi: userMoviesApi, /*userId*/ });
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal server error")
    }
};

const deleteFavoriteMovie = async (req, res) => {
    try {
        const answer = await users.deleteFavorite(req.decoded.user, req.body.title);
        if (answer) {
            const msj = `Has eliminado la pelicula: ${req.body.title} de la tabla de favoritos`;
            console.log("Respondiendo a la ruta DELETE FAV MOVIE")
            res.status(200).json({ "message": msj })
        } else {
            res.status(400).json({ msj: "La pelicula que quieres eliminar no existe" });
        }
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal server error")
    }
};

const createUser = async (req, res) => {
    let newUser = req.body
    const user = req.body.emailSignup
    const response = await users.createUser(newUser);
    // const response = await users.validatedUser(newUser);
    if (response !== 0) {
        const payload = {
            check: true,
            user: user
        };
        const token = jwt.sign(payload, SECRET, {
            expiresIn: "12000000ms" // 1200 segundos para que expire
        });
        //Almacenamos el token en las cookies
        res.cookie('token', token).status(200).redirect("/");
    }

};

const validatedUser = async (req, res) => {
    let credentials = req.body;
    const user = req.body.email
    const response = await users.validatedUser(credentials);
    if (response !== 0) {
        const payload = {
            check: true,
            user: user
        };
        const token = jwt.sign(payload, SECRET, {
            expiresIn: "12000000ms" // 1200 segundos para que expire
        });
        //Almacenamos el token en las cookies
        res.cookie('token', token).status(200).redirect("/");
    } else {
        res.status(401).json({ msj: "User not found, check if you write your user correctly" })
    };
};

const getLogin = (req, res) => res.render('login');

const getSingup = (req, res) => res.render('signup');



module.exports = {
    addFavorite,
    getFavorites,
    deleteFavoriteMovie,
    getLogin,
    getSingup,
    createUser,
    validatedUser
}