/**
 * @author Javier Fuertes, Gabriela García y Pablo Mateos 
 * @exports usersSQL
 * @namespace SQLQueries 
 */
const pool = require('../utils/pg_pool');
const queries = require('../queries/queriesUser');

/**
 * Description: This function adds the user's favorite movies to the database.
 * @memberof SQLQueries 
 * @method addFavorite
 * @async 
 * @param {Object} fav - Object representing a favorite film
 * @param {string} fav.user - User ID
 * @param {string} fav.title - Film title
 * @param {string} fav.year - Film release year
 * @param {string} fav.director - Film director
 * @param {string} fav.genre - Film genre
 * @param {string} fav.runtime - Film runtime
 * @param {string} fav.img - URL of the film's poster image
 * @return {Object} save movie in database
 * @throws {Error} error saving the movie in the database, message with the error
 */
const addFavorite = async (fav, emailFK) => {
    const { title, year, director, genre, runtime, poster } = fav;
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query(queries.addFavorite, [title, year, director, genre, runtime, poster, emailFK ]);
        result = data.rowCount;
    }
    catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release()
    };
    return result;
};
/**
 * Description: This function returns the user's favorites to the database
 * @memberof SQLQueries 
 * @method getFavorites
 * @async 
 * @return {Object}  all the user's favorite movies
 * @throws {Error} message with the error
 */
const getFavorites = async (user) => {
    console.log(user);
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query(queries.getFavorites, [user]);
        result = data.rows;
    }
    catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    };
    return result;
};

const deleteFavorite = async (userId, title) => {
    console.log(userId, title);
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query(queries.deleteFavorite, [userId, title]);
        result = data.rows;
    }
    catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    };
    return result;
};

const createUser = async (user) => {
    const { emailSignup, passwordSignup } = user;
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(queries.createUser, [emailSignup, passwordSignup]);
        result = data.rowCount;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    };
    return result;
};

const validatedUser = async (user) => {
    const { email, password } = user;
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(queries.validatedUser,[email, password]);
        result = data.rowCount;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    };
    return result;
};

const users = {
    addFavorite,
    getFavorites,
    deleteFavorite,
    createUser,
    validatedUser
}

module.exports = users;