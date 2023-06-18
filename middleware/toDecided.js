const express = require('express');

const protectedPaths = express.Router();

const toDecided = protectedPaths.use((req, _, next) => {
    let admin;
    if (req.cookies.token) {
        admin = JSON.parse(Buffer.from(req.cookies.token.split('.')[1], 'base64').toString()).admin;
        next();
    };
});

module.exports = {
    toDecided
}