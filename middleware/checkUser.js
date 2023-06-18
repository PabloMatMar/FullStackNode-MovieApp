const express = require('express');

const protectedPaths = express.Router();

const user = protectedPaths.use((req, res, next) => {
    let admin = false;
    if (req.cookies.token)
        admin = JSON.parse(Buffer.from(req.cookies.token.split('.')[1], 'base64').toString()).admin;
    !admin ? next() : res.status(401).render("home", { logged: true, noUser: true });
});

module.exports = {
    user
}