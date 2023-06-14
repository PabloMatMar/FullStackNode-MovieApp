const mongoose = require('mongoose');
const objectSchema = {
    title: {
        type: String,
        required: true,
        unique: true
    },
    poster: {
        type: String,
        required: true
    },
    year:{
        type: Number,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    genre:{
        type: String,
        required: true
    },
    runtime:{
        type: String,
        required: true
    },
    plot:{
        type: String,
        required: true
    },
    actors:{
        type: String,
        required: true

    },
    language:{
        type: String,
        required: true
    },
    critics:{
        type: Array,
        requiered: false
    }

};

const movieSchema = mongoose.Schema(objectSchema);
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
