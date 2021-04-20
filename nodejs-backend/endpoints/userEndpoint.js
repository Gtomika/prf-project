const mongoose = require('mongoose');
const passport = require('passport');

const userModel = mongoose.model('user');

const attachEndpoints = function(router) {

    //POST user-re: regisztráció
    router.route('/user').post((req, res, next) => {
        if(req.body.username && req.body.password) {
            //van felhasználónév és jelszó
            userModel.findOne({username: req.body.username}, (error, user) => {
                if(error) {
                    console.log(error);
                    return res.status(500).send({message:'Adatbázishiba regisztáció során!'});
                }
                if(user) {
                    return res.status(400).send({message:'Ez a felhasználó már létezik!'});
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
                            return res.status(500).send({message:'Adatbázishiba regisztáció során!'});
                        }
                        return res.status(200).send({message:'Sikeres regisztráció!'});
                    })
                }
            }) 
        } else {
            return res.status(400).send({message:'Hiányos adatok: a regisztrációhoz felhasználónév és jelszó kell!'});
        }
    });

    //PUT user-re: felhasználó jelszavának frissítése (csak bejelentkezett felhasználó végezheti)
    router.route('/user').put((req, res, next) => {
        if(!req.isAuthenticated()) {
            return res.status(401).send({message:'Ehhez be kell jelentkezni!'})
        }
        if(req.body.username && req.body.password && req.body.newPassword) {
            //vannak adatok
            userModel.findOne({username: req.body.username}, (error, user) => {
                if(error) {
                    console.log(error);
                    return res.status(500).send({message:'Adatbázishiba jelszóváltás során!'});
                }
                if(user) {
                    //van ilyen felhasználó, ellenőrizzük a jelszvát
                    passport.authenticate('local', function(error, user) {
                        //visszakaptuk az authentikáció eredményét
                        if(error) {
                            //az error itt lehet adatbázis agy authentikációs hiba is
                            console.log(error);
                            return res.status(401).send({message:error});
                        }
                        //a kapott jelszó helyes, ez tényleg ő
                        user.password = req.body.newPassword;
                        user.save((error) => {
                            if(error) {
                                return res.status(500).send({message:'Adatbázishiba jelszóváltás során!'});
                            }
                            console.log('Jelszo megvaltozott!');
                            return res.status(200).send({message:'A jelszó sikeresen megváltozott!'});
                        });
                    })(req, res);
                } else {
                    return res.status(400).send({message:'Ez a felhasználó nem létezik!'});
                }
            }) 
        } else {
            return res.status(400).send({message:'Hiányos adatok: a jelszóváltáshoz felhasználónév, jelszó és új jelszó kell!'});
        }
    });

    //DELETE user-re: felhasználó törlése (csak bejelentkezett felhasználó végezheti)
    router.route('/user').delete((req, res, next) => {
        if(!req.isAuthenticated()) {
            return res.status(401).send('Ehhez be kell jelentkezni!')
        }
        if(req.body.username && req.body.password) {
            userModel.findOne({username: req.body.username}, (error, user) => {
                if(error) {
                    console.log(error);
                    return res.status(500).send({message:'Adatbázishiba törlés során!'});
                }
                //van ilyen felhasználó
                passport.authenticate('local', function(error, user) {
                    //visszakaptuk az authentikáció eredményét
                    if(error) {
                        //az error itt lehet adatbázis agy authentikációs hiba is
                        console.log(error);
                        return res.status(401).send({message:error});
                    }
                    //a kapott jelszó helyes, ez tényleg ő
                    user.delete((delError) => {
                        if(delError) {
                            return res.status(500).send({message:'Adatbázishiba törlés során!'});
                        }
                        return res.status(200).send({message:'Felhasználó törölve!'});
                    });
                })(req, res);
               
            });
        } else {
            return res.status(400).send({message:'Hiányos adatok: a törléshez felhasználónév és jelszó kell!'})
        }
    });
}

module.exports = attachEndpoints;