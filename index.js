require('dotenv').config();
const {SECRET, BASE_URL, CLIENT_ID, ISSUER} = process.env

const express = require('express');
const request = require('request');//¿Que ez ezto?
const morgan = require('morgan');
const mongoose = require("mongoose");
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./utils/mongoBase');
require('./utils/pg_pool');
const { auth } = require('express-openid-connect');


const config = {
    authRequired: false,
    auth0Logout: true,
    secret: SECRET,
    baseURL: BASE_URL,
    clientID: CLIENT_ID,
    issuerBaseURL: ISSUER
};

//Exportacion de las rutas
const adminRoutes = require('./routes/moviesAdminRoutes');
const homeRoutes = require('./routes/homeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const searchRoutes = require('./routes/searchRoutes');
const createMovieRoutes = require('./routes/createMovieRoutes');
const updateMovieRoutes = require('./routes/updateMovieRoutes');
const favMoviesRoutes = require('./routes/favMoviesRoutes');
// const config = require('./utils/auth')

const app = express();
const port = 3000;

// Template engine
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// Middlewares
app.use(express.json()); // Habilitar tipo de dato a recibir
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(morgan('combined'));
app.use(cors());
app.use(cookieParser());
app.use(auth(config));
const isAuth = require('./middleware/checkAuth')


// Rutas users
app.get('/', (req, res) => {
    let response = req.oidc.isAuthenticated()
    console.log(response)
    let userData = req.oidc.user
    console.log(userData)
    res.render('home', { isAuthenticated: req.oidc.isAuthenticated() })
})

app.use('/movies', isAuth.isAuth, adminRoutes)
app.use('/dashboard', isAuth.isAuth, dashboardRoutes)
app.use('/search', isAuth.isAuth, searchRoutes)
app.use('/createmovie', isAuth.isAuth, createMovieRoutes)
//app.use('/favmovies', isAuth.isAuth, favMoviesRoutes)
app.use('/updatemovie', isAuth.isAuth, updateMovieRoutes)

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`)
})