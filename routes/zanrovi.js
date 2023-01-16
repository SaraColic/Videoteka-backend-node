const express = require("express");
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const zanrovi = express.Router()


function getCookies(req) {
    if (req.headers.cookie == null) return {};

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookies = {};

    rawCookies.forEach( rawCookie => {
        const parsedCookie = rawCookie.split('=');
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });

    return parsedCookies;
};

function authToken(req, res, next) {
    const cookies = getCookies(req);
    const token = cookies['token'];
  
    if (token == null) return res.redirect(301, '/login');

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.redirect(301, '/login');
        console.log(user.tip);
        if(user.tip == 2){
            res.cookie = `token=;SameSite=Lax`;
            res.redirect(301, '/login');
        }

        req.user = user;
    
        next();
    });
}

zanrovi.get('/', authToken ,(req, res) => {
    res.sendFile('zanrovi.html', {root: './static/admin/zanrovi'});
})

zanrovi.get('/dodaj', authToken, (req, res) => {
    res.sendFile('zanroviDodaj.html', {root: './static/admin/zanrovi'})
})

zanrovi.get('/izmeni', authToken, (req, res) => {
    res.sendFile('zanroviIzmeni.html', {root: './static/admin/zanrovi'})
})

module.exports = zanrovi;