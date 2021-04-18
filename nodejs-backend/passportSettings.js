const passport = require('passport');
const mongoose = require('mongoose');

const userModel = mongoose.model('user');

//Passport azonosítási stratégia

const localStrategy = require('passport-local').Strategy;

//itt kell megadni, hogy mi történjen ha a local stratégiával akarunk bejelentkeztetni valakit
passport.use('local', new localStrategy(function(username, password, done) {
  userModel.findOne({'username': username}, function(err, user) {
    if(err) {
      return done('Hiba a lekérés során', null);
    }
    if(!user) {
      return done('Nincs ilyen felhasználó!', null);
    }
    //user sémában deklarált ellenőrző metódus használata
    user.comparePasswords(password, function(error, isMatch) {
      if(error) {
        return done(error, false);
      }
      if(!isMatch) {
        return done('Hibás jelszó', false);
      }
      return done(null, user);
    });
  })
}));

//meghívódik, ha beléptetjük a felhasználót
passport.serializeUser(function(user, done) {
    if(!user) {
      return done('Nincs megadva beléptethető felhasználó!', null);
    }
    return done(null, user);
});

//meghívódik, ha kiléptetjük a felhasználót
passport.deserializeUser(function(user, done) {
    if(!user) {
      return done('Nincs megadva kiléptethető felhasználó!', null);
    }
    return done(null, user);
});

//Kiexportálás

module.exports = passport;
