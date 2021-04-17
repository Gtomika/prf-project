//Függőségek importálása

const express = require('express');
const cors = require('cors');
const path = require('path');
const fileSystem = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

//Egyéb fájlok importálása

const router = require('./routes');
const secrets = require('./secrets.json'); //ez nincs verziózva!!!
const constants = require('./constants.json');
const passport = require('./passportSettings');

//Express app létrehozása

const app = express();

//Middleware-ek csatlakoztatása

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use(expressSession({secret: secrets.expressSessionSecret, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

//Az angular app felcsatlakoztatása (ha létezik). Ha nem létezik, akkor development módban vagyunk.
const pathString = constants.angularDist + '/' + constants.angularFrontendName;
const angularPath = path.join(__dirname, pathString);
app.use(express.static(angularPath));

app.use(constants.apiRoute, router); //router felrakása API routra

//root URL hívásakor fut.
app.get('/', function (req, res) {
    //létezik-e az angular dist mappa, ahol a buildelt angular app van?
    if(fileSystem.existsSync(angularPath)) {
        /*
        Megvan az angular dist, vélhetőleg production módban vagyunk. Ilyenkor küldjük 
        az angular index.html fájlját.
        */
        const angularIndexPath = path.join(__dirname, pathString+"/index.html");
        res.sendFile(angularIndexPath);
    } else {
        /*
        Nem volt elérhető, feltehetőleg development módbn vagyunk, ilyenkor valami 
        kis random szöveget jelenítek meg. A frontent a localhost:4200 alatt lesz.
        */
        const date = new Date();
        const millis = date.getMilliseconds();
        res.send('Hello: ' + millis); 
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
