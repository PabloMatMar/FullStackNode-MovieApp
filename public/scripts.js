console.log("SCRIPT LINKADO");

//despliegue del menu 'hamburguesa'

if (document.title !== "Movies" && document
  .title !== "updateMovie") {
  let burger = document.querySelector(".burger_menu");

  burger.addEventListener("click", () => {
    let links = document.getElementById("links_menu");
    if (links.style.display === "block") {
      links.style.display = "none";
    } else {
      links.style.display = "block";
    }
  });
};


//LLAMADAS A RUTAS DE ADMIN

//Ruta para crear pelicula en mongo:
const createMovie = async (movie) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(movie)
  };
  const BASE_URL = 'http://localhost:3000/movies/createMovie';
  const response = await fetch(BASE_URL, options);
  response.status == 201 ? alert("La pelicula " + movie.title + " ha sido creada") : alert("La pelicula " + movie.title + " no ha podido ser creada. Comprueba que el titulo no este ya en la coleccion de peliculas en /movies");
};

//Ruta para eliminar pelicula de mongo:
const deleteFavorite = async (title) => {
  try {
    const method = {
      method: 'DELETE'
    };
    const BASE_URL = 'http://localhost:3000/movies/deleteMovie?title=' + title;
    const response = await fetch(BASE_URL, method);
    response.status == 200 ? alert("La pelicula " + title + " ha sido eliminada") : alert("La pelicula " + title + " no ha podido ser eliminada. Comprueba que hayas escrito bien el titulo.");
  } catch (err) {
    alert(err)
    console.log(err)
  };
};
//Ruta para actualizar pelicula de mongo:
const updateMovie = async (movie) => {
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movie)
    };
    const BASE_URL = 'http://localhost:3000/movies/updateMovie';
    const response = await fetch(BASE_URL, options);
    response.status === 201 ? alert("La pelicula " + movie.title + " ha sido actualizada") : alert("La pelicula " + movie.title + " no ha podido ser actualizada. Comprueba que hayas escrito bien el titulo.");
  } catch (err) {
    alert(err)
    console.log(err)
  };
};

//LLAMADAS A RUTAS DE USUARIO
//Ruta para añadir pelicula a favoritos: 
const addFavorite = async (movie) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movie)
    };
    const BASE_URL = 'http://localhost:3000/favMovies';
    const response = await fetch(BASE_URL, options)
    response.status == 201 ? alert("La pelicula " + movie.title + " ha sido añadida a favoritos") : alert("La pelicula " + movie.title + " no ha podido ser añadida. Comprueba que el titulo no este ya en la coleccion de peliculas en /favmovies");
  } catch (err) {
    alert(err);
    console.log(err);
  }
}
//Ruta para eliminar pelicula de favoritos:
const deleteFavMovie = async (data) => {
  try {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const BASE_URL = 'http://localhost:3000/favmovies';
    const response = await fetch(BASE_URL, options);
    response.status == 200 ? alert("La pelicula " + data.title + " ha sido eliminada de tu lista de favoritos") : alert("La pelicula " + data.title + " no ha podido ser eliminada. Es probable que ya la hayas eliminado refresca tu pagina.");
  } catch (err) {
    alert(err);
    console.log(err);
  };
};


//Eventos para capturar los datos de los formularios

if (document.title === "singup") {
  //validacion de la contraseña y el usuario cuando se registra:
  document.querySelector("form.signup").addEventListener("submit", (event) => {
    event.preventDefault(); // parar envío

    let validated = true;
    if (event.target.passwordSignup.value !== event.target.password2Signup.value ||
      !(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{6,16}$/.test(event.target.passwordSignup.value)) ||
      !(/^[a-zA-Z0-9_.]+@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,3}/.test(event.target.emailSignup.value)))
      validated = false;

    if (!validated)
      alert(
        "Empty fields or fields not complete:" +
        "\n" +
        "Invalid email format." +
        "\n" +
        "The password must be between 6 and 16 characters." +
        "\n" +
        "Passwords did not match."
      );

    // Comprobación final - Todo validado
    if (validated) {
      alert("Formulario enviado");
      event.target.submit();
    };
  });
};

//Evento para capturar los datos y llamar a la funcion para actualizar pelicula a lista de mongo a traves de admin:
if (document.title === "updateMovie") {

  document.getElementById("updateMovie").addEventListener("click", async (e) => {
    e.preventDefault();
    const form = document.querySelector(".updateMovie").elements;
    const data = {};
    for (let input of form)
      data[input.name] = input.value;
    await updateMovie(data);
  });
}
//Evento para capturar los datos y llamar a la funcion para eliminar pelicula a lista de mongo a traves de admin:
if (document.title === "Movies") {
  const buttons = document.getElementsByClassName("delete")
  for (let i = 0; i < buttons.length; i++)
    document.getElementById(`delete${i}`).addEventListener('click', async (e) => {
      e.preventDefault;
      let movie = document.getElementById(`title${i}`).innerHTML;
      const cleanTitle = movie.slice(7,);
      const titleMovie = cleanTitle.trim();
      if (movie)
        await deleteFavorite(titleMovie);
    });
}
//Evento para capturar los datos y llamar a la funcion para crear pelicula a lista de mongo a traves de admin:
if (document.title === "CreateMovie") {
  document.getElementById("createMovie").addEventListener("click", async (e) => {
    e.preventDefault();
    const form = document.querySelector(".createMovie").elements;
    const data = {};
    for (let input of form)
      input.name == 'title' ? data[input.name] = input.value.toLowerCase() : data[input.name] = input.value;
    await createMovie(data);
  });
};
//Evento para capturar los datos y llamar a la funcion para añadir pelicula favorita de la lista de un usuario:

if (document.title === "search") {
  let favButton = document.getElementById("fav");
  if (favButton != undefined)
    favButton.addEventListener('click', async (e) => {
      e.preventDefault();
      let title = document.getElementById("title").innerHTML;
      let year = document.getElementById("year").innerHTML;
      let director = document.getElementById("director").innerHTML;
      let runtime = document.getElementById("runtime").innerHTML;
      let genre = document.getElementById("genre").innerHTML;
      let img = document.getElementById("img").src;
      const data = {
        title: title.slice(7),
        year: year,
        director: director,
        genre: genre,
        runtime: runtime,
        img: img
      };
      await addFavorite(data);
    });
};

//Evento para capturar los datos y llamar a la funcion para eliminar pelicula favorita de la lista de un usuario:

if (document.getElementById("favMovies") != null) {
  const buttons = document.getElementsByClassName("delete")
  for (let i = 0; i < buttons.length; i++) {
    let deleteButton = document.getElementById(`delete${i}`);
    deleteButton.addEventListener('click', async (e) => {
      e.preventDefault;
      let title = document.getElementById(`title${i}`).innerHTML;
      const data = {
        title: title.slice(7,)
      };
      await deleteFavMovie(data);
    });
  };
};
