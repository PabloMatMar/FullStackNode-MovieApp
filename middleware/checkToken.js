const express = require('express');
jwt = require('jsonwebtoken');
require('dotenv').config();
const { SECRET } = process.env;


const protectedPaths = express.Router();
const token = protectedPaths.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                console.log(err, "TOKEN INVALIDO");
            } else {
                req.decoded = decoded;
                next();
            };
        });
    } else
        res.status(401).send('You cant navegete if you dont register. Register Now: <a href="/signup">Authenticate</a> ');
});

module.exports = {
    token
}