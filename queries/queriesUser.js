const queries = {
    createUser:`
    INSERT INTO users(email, password, admin)
    VALUES ($1,$2,$3);
    `,
    validatedUser:`
    SELECT *
    FROM users
    WHERE email = $1 AND password = $2;
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
    `
}
module.exports = queries;