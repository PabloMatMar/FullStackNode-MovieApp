//despliegue del menu 'hamburguesa'
if (document.querySelector(".burger_menu")) {
  document.querySelector(".burger_menu").addEventListener("click", () => {
    let links = document.getElementById("links_menu");
    links.style.display == "block" ? links.style.display = "none" : links.style.display = "block";
  });
}


//LLAMADAS A RUTAS DE ADMIN

//Ruta para crear pelicula en mongo:
const createMovie = async (movie) => {
  let response = { status: 500 };
  try {
    response = await fetch('/movies/createMovie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movie)
    });
    location.href = `/movies`;
  } catch (err) {
    console.log(err);
  };
  if (response.status != 201)
    alert("The movie " + movie.title + " could not be created check that the title is not repeated");
};

//Ruta para eliminar pelicula de mongo:
const deleteMovie = async (title) => {
  let response = { status: 500 };
  try {
    response = await fetch('/movies/deleteMovie?title=' + title, {
      method: 'DELETE'
    });
    location.href = `/movies`;
  } catch (err) {
    console.log(err);
  };
  if (response.status != 200)
    alert("The movie " + title + " could not be deleted, you probably have already deleted it, refresh the page to check it.");
};

//Ruta para actualizar pelicula de mongo:
const updateMovie = async (movie) => {
  let response = { status: 500 };
  try {
    response = await fetch('/movies/updateMovie', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movie)
    });
    location.href = `/movies`;
  } catch (err) {
    console.log(err);
  };
  if (response.status != 201)
    alert("The movie " + movie.title + " could not be deleted, you probably have already deleted it, refresh the page to check it.");
};

//LLAMADAS A RUTAS DE USUARIO
//Ruta para añadir pelicula a favoritos: 
const addFavorite = async (movie) => {
  let response = { status: 500 };
  try {
    response = await fetch('/favMovies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movie)
    });
    location.href = `/favmovies`;
  } catch (err) {
    console.log(err);
  };
  if (response.status != 201)
    alert("The movie " + movie.title + " could not be add to favorites list, you probably have already deleted it, refresh the page to check it.");
};

//Ruta para eliminar pelicula de favoritos:
const deleteFavMovie = async (data) => {
  let response = { status: 500 };
  try {
    response = await fetch('/favmovies', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    location.href = `/favmovies`;
  } catch (err) {
    alert(err);
    console.log(err);
  };
  if (response.status != 200)
    alert("The movie " + data.title + " could not be deleted from favorites list, you probably have already deleted it, refresh the page to check it.");
};

//Ruta para renderizar mensajes en los intentos de registro:

const render = async (param) => {
  try {
    location.href = "/signup/:" + JSON.stringify(param);
  } catch (err) {
    console.log(err);
  };
};

//Eventos para capturar los datos de los formularios

if (document.getElementById("singup") != null) {
  //validacion de la contraseña y el usuario cuando se registra:
  document.querySelector("form.signup").addEventListener("submit", (event) => {
    event.preventDefault(); // parar envío
    let errs = [0, 0, 0, 0];
    if (event.target.passwordSignup.value !== event.target.password2Signup.value)
      errs[0] = 1;
    if (!(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{6,16}$/.test(event.target.passwordSignup.value)))
      errs[1] = 1;
    if (!(/^[a-zA-Z0-9_.]+@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,3}/.test(event.target.emailSignup.value)))
      errs[2] = 1;
    if (event.target.avatar.value != null && !/.*(jpg|png|gif)$/.test(event.target.avatar.value))
      errs[3] = 1;
    for (let i = 0; i < 10000; i++) {
      console.log(event.target.avatar.value);
    }
    errs.find(e => e == 1) == 1 ? render(JSON.stringify(errs)) : event.target.submit();
  });
};

//Evento para capturar los datos y llamar a la funcion para actualizar pelicula a lista de mongo a traves de admin:

if (document.title == "Movies") {
  const anchors = document.getElementsByClassName("update");
  for (let i = 0; i < anchors.length; i++)
    document.getElementById(`update${i}`).addEventListener('click', async (e) => {
      e.preventDefault;
      let title = document.getElementById(`title${i}`).innerHTML;
      title = title.slice(7).trim();
      localStorage.setItem("title", title);
    });
};

if (document.title === "updateMovie") {
  document.getElementById("updateMovie").addEventListener("click", async (e) => {
    e.preventDefault();
    const form = document.querySelector(".updateMovie").elements;
    const data = {};
    for (let input of form)
      data[input.name] = input.value;
    await updateMovie({ ...{ 'title': localStorage.getItem("title") }, ...data });
  });
};
//Evento para capturar los datos y llamar a la funcion para eliminar pelicula a lista de mongo a traves de admin:
if (document.title === "Movies") {
  const buttons = document.getElementsByClassName("delete")
  for (let i = 0; i < buttons.length; i++)
    document.getElementById(`delete${i}`).addEventListener('click', async (e) => {
      e.preventDefault;
      let movie = document.getElementById(`title${i}`).innerHTML;
      const cleanTitle = movie.slice(7);
      const titleMovie = cleanTitle.trim();
      if (movie)
        await deleteMovie(titleMovie);
    });
};
//Evento para capturar los datos y llamar a la funcion para crear pelicula a lista de mongo a traves de admin:
if (document.title == "CreateMovie") {
  document.getElementById("createMovie").addEventListener("click", async (e) => {
    e.preventDefault();
    const form = document.querySelector(".createMovie").elements;
    const data = {};
    for (let input of form)
      input.name == 'title' ? data[input.name] = input.value[0].toUpperCase().concat(input.value.slice(1).toLowerCase()) : data[input.name] = input.value;
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
      let poster = document.getElementById("poster").src;
      const data = {
        title: title.slice(7),
        year: year.slice(5),
        director: director.slice(10),
        genre: genre.slice(7),
        runtime: runtime.slice(9),
        poster: poster
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
        title: title.slice(7)
      };
      await deleteFavMovie(data);
    });
  };
};

//Evento para mostrar el spinner mientras se carga la pelicula(el scrapping mas bien)

if (document.title == "search") {
  document.getElementById("search-button").addEventListener("click", (e) => {
    let section = document.getElementById("card")
    setTimeout(function () {
      if (section != null)
        while (section.firstChild)
          section.removeChild(section.firstChild);
      else {
        section = document.getElementById("spinner");
        section.setAttribute('class', 'card')
      }
      const spinner = document.createElement("img");
      section.appendChild(spinner);
      spinner.setAttribute('id', 'gif');
      spinner.src = "/logos/spinner2.gif";
    }, 500);
  })
}
