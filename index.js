require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const jwt = require('express-jwt');
const cookieParser = require('cookie-parser');
require('./utils/mongoBase');
require('./utils/pg_pool');


//swagger
const swaggerUi = require('swagger-ui-express');//Requiere libreria de Swagger (La UI)
const swaggerDocument = require('./swagger.json'); //Requiere ruta relativa del json que contiene la documentación de la API

//jsdoc
//const jsdoc = require('express-jsdoc-swagger');


//Exportacion de las rutas
const userSingupRoutes = require('./routes/userSingUpRoutes');
const userLoginRoutes = require('./routes/userLoginRoutes');
const logoutRoutes = require('./routes/logoutRoutes');
const adminRoutes = require('./routes/moviesAdminRoutes');
const homeRoutes = require('./routes/homeRoutes');
const searchRoutes = require('./routes/searchRoutes');
const favMoviesRoutes = require('./routes/favMoviesRoutes');

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
app.use('/api-docs-swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));//Endpoint que servirá la documentación en el navegador, se le pasa la variable que apunta al .json que contiene la documentación.
const checkToken = require('./middleware/checkToken').token;


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
app.use('/search',checkToken, searchRoutes);
//Rutas para administrador:
app.use('/movies',checkToken, adminRoutes);
//Rutas para ver las peliculas favoritas de un usuario:
app.use('/favmovies',checkToken, favMoviesRoutes);

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`)
})