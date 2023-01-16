const express = require("express");
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const korisnici = express.Router()


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
        if(user.tip != 0){
          //  console.log("kako sam uso ovde jebo mamu")
          //  console.log(user.tip);
            res.redirect(301, '/admin');
        }

        req.user = user;
    
        next();
    });
}

korisnici.get('/', authToken ,(req, res) => {
    res.sendFile('korisnici.html', {root: './static/admin/korisnici'});
})

korisnici.get('/dodaj', authToken, (req, res) => {
    res.sendFile('korisniciDodaj.html', {root: './static/admin/korisnici'})
})

korisnici.get('/izmeni', authToken, (req, res) => {
    res.sendFile('korisniciIzmeni.html', {root: './static/admin/korisnici'})
})

module.exports = korisnici;