const passport = require('passport')

const attachEndpoints = function(router) {

    //POST login-ra: bejelentkezés
    router.route('/login').post((req, res, next) => {
        console.log(req.body);
        if(req.body.username && req.body.password) {
            //van név és jelszó: azonosítási stratégia választása
            passport.authenticate('local', function(error, user) {
                //visszakaptuk az authentikáció eredményét
                if(error) {
                    console.log(error);
                    return res.status(503).send('Szerverhiba a bejelentkezés során!');
                }
                //express session beléptető metódusa
                req.logIn(user, function(error) {
                    if(error) {
                        console.log(error);
                        //ide jön be a hiba a serialize metódusból
                        return res.status(503).send('Szerverhiba a bejelentkezés során!');
                    }
                    res.status(200).send('Sikeres bejelentkezés!');
                });
            })(req, res);
        } else {
            return res.status(400).send('Hiányzó adatok: nincs felhasználónév vagy jelszó!');
        }
    });

    //POST logout-ra: kijelentkezés
    router.route('/logout').post((req, res, next) => {
        if(req.isAuthenticated()) {
            //a kliens be van jelentkezve
            req.logOut();
            return res.status(200).send('Sikeres kijelentkezés!');
        } else {
            return res.status(200).send('Nem is volt bejelentkezve!');
        }
    });

}

module.exports = attachEndpoints;