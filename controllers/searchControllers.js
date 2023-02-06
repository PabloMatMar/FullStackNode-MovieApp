require('dotenv').config();
const Movies = require('../models/moviesMongo');
const scraper = require('../utils/scraper');
const { API_KEY } = process.env


const getSearch = (req, res) => {
    res.render('search');
}

const startScraping = async (title) => {
    try {
        // ---Descomenta las 2 siguientes líneas para hacer scraping---
        const products = await scraper.scrap("https://www.filmaffinity.com/en/search.php?stype=title&stext=" + title);
        // console.log(products)
        return products /*.json({ Critics: products[0].Critics, Puntuacion: products[0].Punctuation });*/
        // res.status(200).json({"mensaje":"Aquí irán los productos"}); // ---Comenta esta línea---
    } catch (error) {
        console.log("Error Scraping")
    }

}


const getSearchForTitleInMongo = async (req, res) => {
    const title = req.params.title
    let param = await Movies.find({ title }, { _id: 0, __v: 0 });
    param = param[0]
    console.log(param)
    if (param !== undefined) {
        const critics = await startScraping(title)
        console.log("ENTRE EN SEARCH SEARCH MONGO")
        console.log(critics)
        res.status(200).render("searchInMongoForTitle", { param, critics: critics })

    } else {
        const title = "/search/" + req.params.title
        res.redirect(title)
    }

}

const getSearchForTitle = async (req, res) => {


    const resp = await fetch(`http://www.omdbapi.com/?t=${req.params.title}&apikey=` + API_KEY);
    let param = await resp.json();
    console.log(param)
    const title = req.params.title
    if (param.Response !== 'False') {
        const critics = await startScraping(title)
        console.log("ENTRE EN SEARCH SEARCH TITLE")
        // console.log(critics)
        let userData = req.oidc.user
        let userId = userData.sub
        res.status(200).render("searchTitle", { param, critics: critics, userId })
    } else {
        console.log("ENTRE EN EL ELSE")
        res.render("noMovie")
    }
}

const postFilmForm = async (req, res) => {

    const title = "/search/local/" + req.body.title.toLowerCase()
    res.redirect(title)
}



module.exports = {
    getSearch,
    getSearchForTitle,
    postFilmForm,
    getSearchForTitleInMongo,
    startScraping


}