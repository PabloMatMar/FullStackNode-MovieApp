const queries = {
    createUser:`
    INSERT INTO users2(email, password)
    VALUES ($1,$2);
    `,
    validatedUser:`
    SELECT *
    FROM users2
    WHERE email = $1 AND password = $2;
    `,
    addFavorite:`
    INSERT INTO favorites2
    (title, year, director, genre, runtime, img, emailfk)
    VALUES ($1, $2, $3, $4, $5, $6, $7);
    `,
    getFavorites:`
    SELECT title, img, director, year, genre, runtime
    FROM favorites2
    WHERE emailFK = $1;
    `,
    deleteFavorite:`
    DELETE
    FROM favorites2 AS e
    WHERE e.emailFK = $1 AND e.title = $2;
    `,
    isAdmin:`
    SELECT *
    FROM users2
    WHERE email = $1 AND admin = 'true';
    `
}
module.exports = queries;