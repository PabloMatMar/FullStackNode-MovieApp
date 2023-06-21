require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const jwt = require('express-jwt');
const cookieParser = require('cookie-parser');
require('./utils/mongoBase');
require('./utils/pg_pool');

//Exportacion de las rutas
const userSingupRoutes = require('./routes/userSingUpRoutes');
const userLoginRoutes = require('./routes/userLoginRoutes');
const logoutRoutes = require('./routes/logoutRoutes');
const adminRoutes = require('./routes/moviesAdminRoutes');
const homeRoutes = require('./routes/homeRoutes');
const searchRoutes = require('./routes/searchRoutes');
const favMoviesRoutes = require('./routes/favMoviesRoutes');
const apiToMongoApi = require('./routes/movieApiToMongoApi');

const app = express();
const port = 3000;

// TEMPLATE ENGINE
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// MIDDLEWARES
app.use(express.json()); // Habilitar tipo de dato a recibir
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(morgan('combined'));
app.use(cors());
app.use(cookieParser());

//Middlewares de acceso
const { token } = require('./middleware/checkToken');
const { admin } = require('./middleware/checkAdmin');
const { user } = require('./middleware/checkUser');


//RUTAS:
//Ruta home
app.use('/', homeRoutes);
//Ruta para registrarse
app.use('/signup', userSingupRoutes);
//Ruta para logearse
app.use('/login', userLoginRoutes);
//Ruta para deslogearse
app.use('/logout', logoutRoutes);
//Rutas para usuario:
app.use('/search', token, searchRoutes);
//Rutas para administrador:
app.use('/movies', admin, token, adminRoutes);
//Rutas para ver las peliculas favoritas de un usuario:
app.use('/favmovies', user, token, favMoviesRoutes);
//Ruta para transferir una pelicula de la API de imb a la Api de mongo
app.use('/transferToMongo', admin, token, apiToMongoApi);

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`)
})