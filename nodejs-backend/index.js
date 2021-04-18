//Függőségek importálása

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

//Egyéb fájlok importálása
const secrets = require('./secrets.json'); //ez nincs verziózva!!!
const constants = require('./constants.json');
const mongodb = require('./mongodb');
const passport = require('./passportSettings');
const router = require('./routes');

//Megmondja, hogy debug módban vagyunk-e (he nem, akkor null lesz)
let debug = constants.isDebug;
if(debug === 'true') {
    console.log('DEBUG mód');
} else {
    console.log('PRODUCTION mód')
    debug = null;
}

//Express app létrehozása
const app = express();

//Middleware-ek csatlakoztatása
app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressSession({secret: secrets.expressSessionSecret, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

//Az angular app felcsatlakoztatása (ha létezik). Ha nem létezik, akkor development módban vagyunk.
const angularPathString = constants.angularDist + '/' + constants.angularFrontendName;
const angularPath = path.join(__dirname, angularPathString);
app.use(express.static(angularPath));

//router felrakása API routra
app.use(constants.apiRoute, router);

//csatlakozás mongodb-hez
let connectionString = null;
if(debug) {
    connectionString = constants.mongoConnectionStringDebug;
} else {
    connectionString = secrets.mongodbConnectionStringProduction;
}
mongodb.connect(connectionString);

//root URL hívásakor fut.
app.get('/', function (req, res) {
    if(debug) {
        const date = new Date();
        const millis = date.getMilliseconds();
        res.send('Hello: ' + millis);
    } else {
        //production módban a root URL az angular alkalmazást adja
        const angularIndexPath = path.join(__dirname, angularPathString+"/index.html");
        res.sendFile(angularIndexPath);
    }
});

//akkor fut, ha semmilyen más funkció nem tudta lekezelni a kérést
app.use((req, res, next) => {
    console.log('Hiba');
    res.status(404);
    res.send('Nem találtam ezt az erőforrást!');
});

//szerver indítása

const port = process.env.PORT || 3080;

app.listen(port, function () {
  console.log('NodeJS szerver fut, port: ' + port);
});
