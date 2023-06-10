/**
 * @author Javier Fuertes, Gabriela García y Pablo Mateos 
 * @exports userControllers
 * @namespace userControllers
 */

const process = require('process');
const users = require('../models/users_sql')
jwt = require('jsonwebtoken');
require('dotenv').config();
const { SECRET } = process.env;


/**
 * Description: This function save a favorite movie of user in the database.
 * @memberof userControllers
 * @method addFavorite
 * @async  
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @return {Object} - an object containing the scraped info.
 * @throws {Err} message with the err during save process.
 */
const addFavorite = async (req, res) => {
    try {
        const response = await users.addFavorite(req.body, req.decoded.user);
        res.status(201).json({ msj: response });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
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
        const userMoviesApi = await users.getFavorites(req.decoded.user);
        res.status(200).render("moviesUser", { favMoviesApi: userMoviesApi });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

const deleteFavoriteMovie = async (req, res) => {
    try {
        const answer = await users.deleteFavorite(req.decoded.user, req.body.title);
        answer ? res.status(200).json({ msj: `Has eliminado la pelicula: ${req.body.title} de la tabla de favoritos` }) : res.status(404).json({ msj: "La pelicula que quieres eliminar no existe" });
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

const createUser = async (req, res) => {
    const response = await users.createUser(req.body);
    if (response !== 0) {
        const payload = {
            check: true,
            user: req.body.emailSignup
        };
        const token = jwt.sign(payload, SECRET, {
            expiresIn: "12000000ms" // 1200 segundos para que expire
        });
        //Almacenamos el token en las cookies
        res.cookie('token', token).status(200).redirect("/");
    }

};

const validatedUser = async (req, res) => {

    const response = await users.validatedUser(req.body);
    if (response != 0) {
        const payload = {
            check: true,
            user: req.body.email
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

const getLogin = (req, res) => {
    try {
        res.render('login');   
    } catch (err) {
        res.status(500).json({ msj: err.message });
    };
};

const getSingup = (req, res) => {
    try {
        res.render('signup');  
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