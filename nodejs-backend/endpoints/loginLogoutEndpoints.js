const passport = require('passport');
const mongoose = require('mongoose');
const util = require('util');

const userModel = mongoose.model('user');

const attachEndpoints = function(router) {

    //POST login-ra: bejelentkezés
    router.route('/login').post((req, res, next) => {
        if(req.body.username && req.body.password) {
            //van név és jelszó: azonosítási stratégia választása
            passport.authenticate('local', function(error, user) {
                //visszakaptuk az authentikáció eredményét
                if(error) {
                    //az error itt lehet adatbázis agy authentikációs hiba is
                    console.log(error);
                    return res.status(401).send({message: error});
                }
                //express session beléptető metódusa
                req.logIn(user, function(error) {
                    if(error) {
                        console.log(error);
                        //ide jön be a hiba a serialize metódusból
                        return res.status(500).send({message: 'Szerverhiba a bejelentkezés során!'});
                    }
                    //minden jó, nézzük meg, hogy admin-e
                    const lMessage = 'Sikeres bejelentkezés!';
                    userModel.findOne({username: req.body.username}, (error, user) => {
                        if(error) {
                            //hiba, tegyük fel, hogy nem admin
                            res.status(200).send({message: lMessage, isAdmin: false});
                        } 
                        if(!user) {
                            res.status(200).send({message: lMessage, isAdmin: false});
                        }
                        res.status(200).send({message: lMessage, isAdmin: user.isAdmin});
                    });
                });
            })(req, res);
        } else {
            return res.status(400).send({message:'Hiányzó adatok: nincs felhasználónév vagy jelszó!'});
        }
    });

    //POST logout-ra: kijelentkezés
    router.route('/logout').post((req, res, next) => {
        if(req.isAuthenticated()) {
            //a kliens be van jelentkezve
            req.logOut();
            return res.status(200).send({message:'Sikeres kijelentkezés!'});
        } else {
            return res.status(200).send({message:'Nem is volt bejelentkezve!'});
        }
    });

    //login-hoz hasonló, de kizárólag a felhasználói adat ellenőrzésére. után nem lesz bejelentkeztetve
    router.route('/authenticate').post((req, res, next) => {
        if(req.body.username && req.body.password) {
             //van név és jelszó: azonosítási stratégia választása
             passport.authenticate('local', function(error, user) {
                //visszakaptuk az authentikáció eredményét
                if(error) {
                    //az error itt lehet adatbázis agy authentikációs hiba is
                    console.log(error);
                    return res.status(200).send({message: 'invalid', isAdmin: false});
                }
                //belépési adatok jók, de admin-e?
                userModel.findOne({username: req.body.username}, (error, user) => {
                    if(error) {
                        //hiba, tegyük fel, hogy nem admin
                        res.status(200).send({message: 'valid', isAdmin: false});
                    } 
                    if(!user) {
                        res.status(200).send({message: 'valid', isAdmin: false});
                    }
                    res.status(200).send({message: 'valid', isAdmin: user.isAdmin});
                });
            })(req, res);
        } else {
            return res.status(400).send({message:'Felhasználónév és jelszó megadása szükséges!', isAdmin: false});
        }
    });
}

module.exports = attachEndpoints;