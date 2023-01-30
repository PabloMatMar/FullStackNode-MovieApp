const pool = require('../utils/pg_pool');
const queries = require('../queries/queriesUser');

const createUser = async (user) => {
    const { emailSignup, passwordSignup } = user;
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(queries.createUser,[emailSignup, passwordSignup])
        result = data.rowCount
        console.log("Respuesta a POST SIGN UP")
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release()
    }
    return result
}

const validatedUser = async (user) => {
    const { email, password } = user;
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(queries.validatedUser,[email, password])
        result = data.rowCount
        console.log("Respuesta a POST LOGIN")
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release()
    }
    return result
}



const users = {
    createUser,
    validatedUser

}

module.exports = users;