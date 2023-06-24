const queries = {
    createUser:`
    INSERT INTO users(email, password, admin, avatar)
    VALUES ($1,$2,$3,$4);
    `,
    getUserData:`
    SELECT *
    FROM users
    WHERE email = $1;
    `,
    addFavorite:`
    INSERT INTO favorites
    (title, year, director, genre, runtime, poster, emailfk)
    VALUES ($1, $2, $3, $4, $5, $6, $7);
    `,
    getFavorites:`
    SELECT title, poster, director, year, genre, runtime
    FROM favorites
    WHERE emailFK = $1;
    `,
    deleteFavorite:`
    DELETE
    FROM favorites AS e
    WHERE e.emailFK = $1 AND e.title = $2;
    `,
    isAdmin:`
    SELECT admin
    FROM users
    WHERE email = $1;
    `,
    updtAvatar:`
    UPDATE users
    SET avatar = $2
    WHERE email = $1;
    `,
    updtPassword:`
    UPDATE users
    SET password = $2
    WHERE email = $1`,
    getAvatar:`
    SELECT avatar
    FROM users
    WHERE email = $1`,
    // editSQL:`
    // UPDATE users
    // SET email = prueba01@gmail.com
    // WHERE password = Prueba001@gmail.com;
    // `
}
module.exports = queries;