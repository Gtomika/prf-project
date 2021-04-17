const passport = require('passport');

//Passport azonosítási stratégia

const localStrategy = require('passport-local').Strategy;

passport.use('local', new localStrategy(function(username, password, done) {
    //TODO
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
