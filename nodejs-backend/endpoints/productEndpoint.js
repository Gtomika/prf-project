const mongoose = require('mongoose');
const passport = require('passport');

const productModel = mongoose.model('product');
const userModel = mongoose.model('user');

const attachEndpoints = function(router) {

    //GET: lekéri a termékeket JSON-ban
    router.route('/product').get((req, res, next) => {
        if(!req.isAuthenticated()) {
            return res.status(401).send({message:'Ehhez be kell jelentkezned!'});
        }
        productModel.find({}, (error, products) => {
            if(error) {
                return res.status(500).send({message: 'Adatbázishiba a termékek lekérése közben!'});
            }
            return res.status(200).send(products);
        })
    });

    //POST termék hozzáadásához, csak admin
    router.route('/product').post((req, res, next) => {
        if(!req.isAuthenticated()) {
            return res.status(401).send({message:'Ehhez be kell jelentkezned!'});
        }
        if(req.body.username && req.body.password) {
            //van felh. és jelszó
            passport.authenticate('local', function(error, user) {
                //visszakaptuk az authentikáció eredményét
                if(error) {
                    //az error itt lehet adatbázis agy authentikációs hiba is
                    console.log(error);
                    return res.status(401).send({message:error});
                }
                //admin-e?
                userModel.findOne({username: req.body.username}, (error, user) => {
                    if(error) {
                        return res.status(500).send({message:'Adatbázishiba a termék mentése során!'});
                    }
                    if(user && user.isAdmin) {
                        //igen
                        if(req.body.name && req.body.description && req.body.price && req.body.imgPath) {
                            //van-e már ilyen?
                            productModel.findOne({name: req.body.name}, (error, existingProduct) => {
                                if(error) {
                                    return res.status(500).send({message:'Adatbázishiba a termék mentése során!'});
                                }
                                if(existingProduct) {
                                    return res.status(400).send({message:'Már van ilyen nevű termék!'});
                                } 
                                //megvannak a termék adatok
                                const product = new productModel(
                                {
                                    name: req.body.name,
                                    description: req.body.description,
                                    price: req.body.price,
                                    imgPath: req.body.imgPath
                                });
                                product.save(error => {
                                    if(error) {
                                        return res.status(500).send({message:'Adatbázishiba a termék mentése során!'});
                                    }
                                return res.status(200).send({message:'Termék elmentve!'});
                                });
                            });
                        } else {
                            res.status(400).send({message: 'Hiányos termék specifikáció!'})
                        }
                    } else {
                        //nem admin
                        return res.status(401).send({message: 'Csak admin adhat hozzá terméket'});
                    }
                });
            })(req, res);
        } else {
            return res.status(401).send({message: 'Termék hozzáadásához admin felh. és jelszó kell!'})
        }
    });

    //PUT adott nevű termék frissítéséhez, csak admin
    router.route('/product').put((req, res, next) => {
        if(!req.isAuthenticated()) {
            return res.status(401).send({message:'Ehhez be kell jelentkezned!'});
        }
        if(req.body.username && req.body.password) {
            //van felh. és jelszó
            passport.authenticate('local', function(error, user) {
                //visszakaptuk az authentikáció eredményét
                if(error) {
                    //az error itt lehet adatbázis agy authentikációs hiba is
                    console.log(error);
                    return res.status(401).send({message:error});
                }
                //admin-e?
                userModel.findOne({username: req.body.username}, (error, user) => {
                    if(error) {
                        return res.status(500).send({message:'Adatbázishiba a termék frissítése során!'});
                    }
                    if(user && user.isAdmin) {
                        //igen
                        if(req.body.name && req.body.description && req.body.price && req.body.imgPath) {
                            //van-e már ilyen?
                            productModel.findOne({name: req.body.name}, (error, existingProduct) => {
                                if(error) {
                                    return res.status(500).send({message:'Adatbázishiba a termék frissítése során!'});
                                }
                                if(existingProduct) {
                                    //néven kívül a többi frissítése
                                    existingProduct.description = req.body.description;
                                    existingProduct.price = req.body.price;
                                    existingProduct.imgPath = req.body.imgPath;
                                    existingProduct.save(error => {
                                        if(error) {
                                            return res.status(500).send({message:'Adatbázishiba a termék frissítése során!'});
                                        }
                                    return res.status(200).send({message:'Termék frissítve!'});
                                    });
                                } else {
                                    //nincs ilyen termék
                                    return res.status(400).send({message:'Nincs ilyen nevű termék! POST-al létrehozhatod!'});
                                }
                            });
                        } else {
                            res.status(400).send({message: 'Hiányos termék specifikáció!'})
                        }
                    } else {
                        //nem admin
                        return res.status(401).send({message: 'Csak admin frissíthet terméket'});
                    }
                });
            })(req, res);
        } else {
            return res.status(401).send({message: 'Termék frissítéséhez admin felh. és jelszó kell!'})
        }
    });

    //DELETE: termék törlése, csak admin
    router.route('/product').delete((req, res, next) => {
        if(!req.isAuthenticated()) {
            return res.status(401).send({message:'Ehhez be kell jelentkezned!'});
        }
        if(req.body.username && req.body.password) {
            //van felh. és jelszó
            passport.authenticate('local', function(error, user) {
                //visszakaptuk az authentikáció eredményét
                if(error) {
                    //az error itt lehet adatbázis agy authentikációs hiba is
                    console.log(error);
                    return res.status(401).send({message:error});
                }
                //admin-e?
                userModel.findOne({username: req.body.username}, (error, user) => {
                    if(error) {
                        return res.status(500).send({message:'Adatbázishiba a termék törlése során!'});
                    }
                    if(user && user.isAdmin) {
                        //igen
                        if(req.body.name) {
                            //van-e már ilyen?
                            productModel.findOne({name: req.body.name}, (error, existingProduct) => {
                                if(error) {
                                    return res.status(500).send({message:'Adatbázishiba a termék törlése során!'});
                                }
                                if(existingProduct) {
                                   existingProduct.delete(error => {
                                        if(error) {
                                            return res.status(500).send({message:'Adatbázishiba a termék törlése során!'});
                                        }
                                        return res.status(200).send({message:'Termék sikeresen törölve!'});
                                   });
                                } else {
                                    //nincs ilyen termék
                                    return res.status(400).send({message:'Nincs ilyen nevű termék!'});
                                }
                            });
                        } else {
                            res.status(400).send({message: 'Hiányos termék specifikáció: név kell!'})
                        }
                    } else {
                        //nem admin
                        return res.status(401).send({message: 'Csak admin törölhet terméket'});
                    }
                });
            })(req, res);
        } else {
            return res.status(401).send({message: 'Termék törléséhez admin felh. és jelszó kell!'})
        }
    });
}

module.exports = attachEndpoints;