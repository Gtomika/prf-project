const express = require('express');

const router = express.Router();

//Endpointok felcsatolása
const loginLogoutEndpoints = require('./endpoints/loginLogoutEndpoints');
loginLogoutEndpoints(router);

const userEndpoint = require('./endpoints/userEndpoint');
userEndpoint(router);

const productEndpoints = require('./endpoints/productEndpoint');
productEndpoints(router);

const imageEndpoints = require('./endpoints/imageEndpoint');
imageEndpoints(router);

//egyszerű státusz endpoint
router.route('/status').get((req, res, next) => {
    return res.status(200).send('PRF Projekt NodeJS szerver');
});

//Exportálás

module.exports = router;