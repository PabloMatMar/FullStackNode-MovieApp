const Movies = require('../models/moviesMongo');
const mongoose = require('mongoose');
require('dotenv').config();
const db = process.env.DB_URL_ATLAS;

const changesFieldInMovies = async () => {
    try {
        const movies = await Movies.find({ Movies }, { _id: 0, __v: 0 });
        for (let i = 0; i < movies.length; i++) {
            //Introduzco el codigo para cambiar el campo que deseo
            console.log("ENTER THE CODE TO CHANGE A FIELD IN MONGO!!");
        };
        await Movies.deleteMany({});
        await Movies.insertMany(movies);
    } catch (err) {
        console.log(err.message);
    };
};

mongoose
    .connect(db)
    .then(() => console.log('mongodb connection success'))
    .catch((error) => console.log(error));

changesFieldInMovies()
    .then(() => mongoose.connection.close())
    .then(() => console.log('closed connection'));