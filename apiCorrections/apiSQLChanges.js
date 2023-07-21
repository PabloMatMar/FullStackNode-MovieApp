const pool = require('../utils/pg_pool');

const changes = async () => {
    let client;
    try {
        client = await pool.connect();
        //Introduzco la query para cambiar el dato, fila, columna o tabla que desee
        await client.query(`DELETE
        FROM favorites`);
    }
    catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release()
    };
};
changes();