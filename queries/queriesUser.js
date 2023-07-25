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
    (title, year, director, genre, runtime, poster, plot, actors, language, review, punctuation, emailfk)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
    `,
    getFavorites:`
    SELECT title, year, director, genre, runtime, poster, plot, actors, language, review, punctuation
    FROM favorites
    WHERE emailFK = $1;
    `,
    getASpecificFavorite: `
    SELECT title, year, director, genre, runtime, poster, plot, actors, language, review, punctuation
    FROM favorites
    WHERE emailFK = $1 AND title = $2;
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
    WHERE email = $1;
    `,
    deleteFavMovies: `
    DELETE
    FROM favorites
    WHERE emailFK = $1;
    `,
    deleteUser: `
    DELETE
    FROM users
    WHERE email = $1;
    `
}
module.exports = queries;