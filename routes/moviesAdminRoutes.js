const express = require('express');
const moviesAdminControllers = require("../controllers/moviesMongoControllers");
const adminRouter = express.Router();

//Ruta para que el admin pueda pedir las peliculas de la API de mongo:
adminRouter.get('/', moviesAdminControllers.getMovies);
//Ruta para que el admin pueda postear el titulo para hacer una peticion especifica a la API de mongo:
adminRouter.post('/', moviesAdminControllers.capturingFormData);
//Ruta para que el admin pueda postear el titulo para hacer una peticion especifica a la API de mongo:
adminRouter.get('/:title', moviesAdminControllers.getSpecificMovieInMongo);
//Ruta para que el admin pueda rellenar un formulario para crear una pelicula en la API de mongodb:
adminRouter.get('/createMovie', moviesAdminControllers.getFormMovie);
//Ruta a la que redirige el boton submit del formulario para que se cree la nueva pelicula en la API de mongo:
adminRouter.post('/createMovie', moviesAdminControllers.createMovie);
//Ruta para que el admin pueda eliminar una pelicula de la API de mongo:
adminRouter.delete('/deleteMovie?', moviesAdminControllers.deleteMovie);
//Ruta para que el admin pueda pedir el formulario para actualizar una pelicula de la API de mongo:
adminRouter.get('/updatemovie', moviesAdminControllers.formUpdateMovie);
//Ruta para que el admin pueda actualizar una pelicula de la API de mongo:
adminRouter.put('/updatemovie', moviesAdminControllers.updateMovie);

module.exports = adminRouter