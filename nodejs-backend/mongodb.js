const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//sikeres kapcsolódás callback
mongoose.connection.on('connected', () => {
    console.log('MongoDB csatlakoztatva.')
});

//sikertelen kapcsolódás callback
mongoose.connection.on('error', () => {
    console.log('Nem sikerült csatlakozni a MongoDB-hez');
});

//It vannak definiálva a sémák

//Felhasználó séma definiálása
var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true}
},
{collection: 'users'});

//Trigger: fusson le a mentés művelet előtt: jelszó hashelés!
userSchema.pre('save', function(next) {
    const user = this;
    if(user.isModified('password')) {
        //ha a jelszó megváltozott
        bcrypt.genSalt(10, function(error, salt) {
            if(error) {
                console.log('Salt generálási hiba!');
                return next(error);
            }
            bcrypt.hash(user.password, salt, function(error, hash) {
                if(error) {
                    console.log('Hashelési hiba!');
                    return next(error);
                }
                user.password = hash;
                return next();
            });
        });
    } else {
        //nincs tennivaló, átadás a következő fv.-nek
        return next;
    }
});

//kell egy metódus, ami meg tudja nézni, hogy a szöveges jelszó
//megegyezik-e a hash-el
userSchema.methods.comparePasswords = function(password, nx) {
    //bcrypt el tudja végezni a hashalést
    bcrypt.compare(password, this.password, function(error, isMatch) {
        nx(error, isMatch);
    });
};

mongoose.model('user', userSchema);

//Objektum exportálás, a kapcsolódás az index.js-ben történik

module.exports = mongoose;