/**
 * @author Pablo Mateos 
 * @version 2.0
 * @namespace users_sql 
 */
require('dotenv').config();
const { ADMIN_KEY } = process.env;
const bcrypt = require('bcrypt');
const pool = require('../utils/pg_pool');
const queries = require('../queries/queriesUser');

/**
 * Description: This function adds the selected movie from the user's favorite list.
 * @memberof users_sql 
 * @method addFavorite
 * @async 
 * @param {Object} fav - The values of the favorite movie.
 * @param {string} emailFK - The name of user that is a forenkey in SQL.
 * @const {Object} pool - Host, username, database and password of ElephantSQL.
 * @property {function} connect - Method to connect to sql server.
 * @property {function} release - Method to disconnect to sql server.
 * @const {Object} client - Conection to DB.
 * @property {function} query - Sql method that passes a query in the first argument and the query values ​​in the second.
 * @property {Object} queries.addFavorite - The query to add a favorite movie.
 * @throws {Error} message with the err during save process.
 */
const addFavorite = async (fav, emailFK) => {
    let client;
    try {
        const { title, year, director, genre, runtime, poster, plot, actors, language, review, punctuation } = fav;
        client = await pool.connect();
        await client.query(queries.addFavorite, [title, year, director, genre, runtime, poster, plot, actors, language, review, punctuation, emailFK]);
    }
    catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release()
    };
};

/**
 * Description: This function get all favorites movies of user in the database.
 * @memberof users_sql 
 * @method getFavorites
 * @async 
 * @param {string} emailFK - The name of user that is a forenkey in SQL.
 * @param {string} title - The name of the movie for a get specific movie. Opcional argument.
 * @const {Object} pool - Host, username, database and password of ElephantSQL.
 * @property {function} connect - Method to connect to sql server.
 * @property {function} release - Method to disconnect to sql server.
 * @const {Object} client - Conection to DB.
 * @property {function} query - Sql method that passes a query in the first argument and the query values ​​in the second.
 * @property {Object} queries.getFavorites - The query to get all favorites movies of the emailFK user.
 * @return {Array} Each element of the array is an object with one of the favorites movies of the emailFK user.
 * @throws {Error} message with the err during save process.
 */

const getFavorites = async (emailFK, title) => {
    let client, result;
    try {
        let data;
        client = await pool.connect();
        title == undefined ? data = await client.query(queries.getFavorites, [emailFK]) : data = await client.query(queries.getASpecificFavorite, [emailFK, title]);
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

/**
 * Description: This function removes the selected movie from the user's favorite list.
 * @memberof users_sql 
 * @method deleteFavorite
 * @async 
 * @param {Object} title - The title of the favorite movie that removes.
 * @param {string} emailFK - The name of user that is a forenkey in SQL.
 * @const {Object} pool - Host, username, database and password of ElephantSQL.
 * @property {function} connect - Method to connect to sql server.
 * @property {function} release - Method to disconnect to sql server.
 * @const {Object} client - Conection to DB.
 * @property {function} query - Sql method that passes a query in the first argument and the query values ​​in the second.
 * @property {Object} queries.deleteFavorite - The query that removes the movie whose title is the title value from the emailFK user's list.
 * @throws {Error} message with the err during save process.
 */

const deleteFavorite = async (emailFK, title) => {
    let client;
    try {
        client = await pool.connect();
        await client.query(queries.deleteFavorite, [emailFK, title]);
    }
    catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    };
};

/**
 * Description: This function create a user.
 * @memberof users_sql 
 * @method createUser
 * @async 
 * @param {Object} user - User name and password to create a user.
 * @property {string} user.emailSignup - User name to create a user.
 * @property {string} user.passwordSignup - password to create a user.
 * @property {string} user.admin - The code that allows the registration as admin.
 * @property {string} user.avatar - user avatar image url.
 * @const {Object} pool - Host, username, database and password of ElephantSQL.
 * @property {function} connect - Method to connect to sql server.
 * @property {function} release - Method to disconnect to sql server.
 * @const {Object} client - Conection to DB.
 * @property {function} query - Sql method that passes a query in the first argument and the query values ​​in the second.
 * @property {Object} queries.createUser - The query that create a user.
 * @property {string} err.detail - Error indicate the user already exist and forced returns 0.
 * @return {number} One if the create user was okey, else, 0.
 * @throws {Error} message with the err during save process.
 */

const createUser = async (user) => {
    let client, result;
    try {
        const { emailSignup, passwordSignup, admin, avatar } = user;
        client = await pool.connect();
        const data = await client.query(queries.createUser, [emailSignup.toLowerCase(), passwordSignup, admin, avatar]);
        result = data.rowCount;
    } catch (err) {
        if (err.detail != undefined && err.detail.endsWith('already exists.'))
            return 0;
        console.log(err);
        throw err;
    } finally {
        client.release();
    };
    return result;
};

/**
 * Description: This function validated the credentials in the login process.
 * @memberof users_sql 
 * @method validatedUser
 * @async 
 * @param {string} email - Email to validate.
 * @param {string} password - Password to validate.
 * @property {string} user.emailSignup - User name to validate.
 * @property {string} user.passwordSignup - password to validate.
 * @property {string} user.admin - The code to validate the admin.
 * @const {Object} pool - Host, username, database and password of ElephantSQL.
 * @property {function} connect - Method to connect to sql server.
 * @property {function} release - Method to disconnect to sql server.
 * @const {Object} client - Conection to DB.
 * @property {function} query - Sql method that passes a query in the first argument and the query values ​​in the second.
 * @property {Object} queries.getUserData - The query that validated the credentials of email user and returns all data of that user.
 * @return {number} One if the validate user was okey, else, 0.
 * @throws {Error} message with the err during save process.
 */

const validatedUser = async (email, password) => {
    let client;
    let result = {
        credential: 0,
        admin: false,
        avatar: null
    };
    try {
        client = await pool.connect();
        const data = await client.query(queries.getUserData, [email]);
        const isPasswordCorrect = await bcrypt.compare(password, data.rows[0].password);
        const checkAdmin = await client.query(queries.isAdmin, [email]);
        if (data.rowCount == 1 && isPasswordCorrect) {
            result.credential = 1;
            result.avatar = data.rows[0].avatar;
        };
        if (checkAdmin.rowCount != 0 && checkAdmin.rows[0].admin == ADMIN_KEY)
            result.admin = true;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    };
    return result;
};

const changesAvatar = async (email, avatar, password) => {
    let client;
    let data = {
        rowCount: 0,
        avatar: null
    }
    try {
        client = await pool.connect();
        const userDatas = await client.query(queries.getUserData, [email]);
        const isPasswordCorrect = await bcrypt.compare(password, userDatas.rows[0].password);
        if (isPasswordCorrect)
            data = await client.query(queries.updtAvatar, [email, avatar]);
        if (data.rowCount == 1)
            data = {
                rowCount: 1,
                avatar: await client.query(queries.getAvatar, [email]).rows
            };
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    };
    return data;
};

const changesPassword = async (email, newPassword, oldPassword) => {
    let client;
    let data = {
        rowCount: 0
    };
    try {
        client = await pool.connect();
        const userDatas = await client.query(queries.getUserData, [email]);
        const isPasswordCorrect = await bcrypt.compare(oldPassword, userDatas.rows[0].password);
        if (isPasswordCorrect)
            data = await client.query(queries.updtPassword, [email, newPassword]);
        if (data.rowCount == 1)
            data = {
                rowCount: 1
            };
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    };
    return data.rowCount;
};

const users = {
    addFavorite,
    getFavorites,
    deleteFavorite,
    createUser,
    validatedUser,
    changesAvatar,
    changesPassword
}

module.exports = users;