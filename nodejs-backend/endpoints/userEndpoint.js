const mongoose = require('mongoose');

const userModel = mongoose.model('user');

const attachEndpoints = function(router) {

    //POST user-re: regisztráció
    router.route('/user').post((req, res, next) => {
        if(req.body.username && req.body.password) {
            //van felhasználónév és jelszó
            userModel.findOne({username: req.body.username}, (error, user) => {
                if(error) {
                    console.log(error);
                    return res.status(500).send('Adatbázishiba regisztáció során!');
                }
                if(user) {
                    return res.status(400).send('Ez a felhasználó már létezik!');
                } else {
                    const newUser = new userModel(
                    {
                        username: req.body.username,
                        password: req.body.password,
                        isAdmin: false
                    });
                    //password titkosító trigger meg for hívódni
                    newUser.save((error) => {
                        if(error) {
                            console.log(error);
                            return res.status(500).send('Adatbázishiba regisztáció során!');
                        }
                        return res.status(200).send('Sikeres regisztráció!');
                    })
                }
            }) 
        } else {
            return res.status(400).send('Hiányos adatok: a regisztrációhoz felhasználónév és jelszó kell!');
        }
    });

    //PUT user-re: felhasználó jelszavának frissítése (csak bejelentkezett felhasználó végezheti)
    router.route('/user').put((req, res, next) => {
        if(!req.isAuthenticated()) {
            return res.status(403).send('Ehhez be kell jelentkezni!')
        }
        if(req.body.username && req.body.password) {
            //van felhasználónév
            userModel.findOne({username: req.body.username}, (error, user) => {
                if(error) {
                    console.log(error);
                    return res.status(500).send('Adatbázishiba jelszóváltás során!');
                }
                if(user) {
                    //módosítások mentése, jelszó hashelő meg fog hívódni
                    user.password = req.body.password;
                    user.save((error) => {
                        if(error) {
                            return res.status(500).send('Adatbázishiba jelszóváltás során!');
                        }
                        return res.status(200).send('A jelszó sikeresen megváltozott!');
                    });
                } else {
                    return res.status(400).send('Ez a felhasználó nem létezik!');
                }
            }) 
        } else {
            return res.status(400).send('Hiányos adatok: a jelszóváltáshoz felhasználónév és új jelszó kell!');
        }
    });

    //DELETE user-re: felhasználó törlése (csak bejelentkezett felhasználó végezheti)
    router.route('/user').delete((req, res, next) => {
        if(!req.isAuthenticated()) {
            return res.status(403).send('Ehhez be kell jelentkezni!')
        }
        if(req.body.username) {
            userModel.findOne({username: req.body.username}, (error, user) => {
                if(error) {
                    console.log(error);
                    return res.status(500).send('Adatbázishiba törlés során!');
                }
                user.delete((delError) => {
                    if(delError) {
                        return res.status(500).send('Adatbázishiba törlés során!');
                    }
                    return res.status(200).send('Felhasználó törölve!');
                })
            });
        } else {
            return res.status(400).send('Hiányos adatok: a törléshez felhasználónév kell!')
        }
    });
}

module.exports = attachEndpoints;