const express = require('express');
jwt = require('jsonwebtoken');
require('dotenv').config();
const { SECRET } = process.env;

const protectedPaths = express.Router();
const token = protectedPaths.use((req, res, next) => {
    const token = req.cookies.token;
    token ? jwt.verify(token, SECRET, (err, decoded) => {
        if (err)
            console.log(err, "TOKEN INVALIDO");
        else {
            req.decoded = decoded;
            next();
        };
    }) : res.status(401).render("home", { noLogin: true });
});

module.exports = {
    token
}