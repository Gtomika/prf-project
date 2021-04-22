const fs = require('fs');
const path = require('path');

const attachEndpoints = function(router) {

    //GET: visszaküld egy képet
    router.route('/images').get((req, res, next) => {
        if(!req.isAuthenticated()) {
            return res.status(401).send({message:'Ehhez be kell jelentkezned!'});
        }
        const rootDir = path.resolve(__dirname, '..');
        //be van jelentkezve
        if(req.query.imageName && req.query.imageName !== '') {
            //meg van adva az útvonal
            fs.readFile(path.join(rootDir.toString(), '/images/'+req.query.imageName), (error, data) => {
                if(error) {
                    //valami hiba, ilyenkor az alap képet küldjük vissza
                    fs.readFile(path.join(__dirname, '/images/not_found.png'), (error, data) => {
                        if(error) {
                            //...
                            return res.status(500).send({message:'Szerverhiba kép beolvasás közben!'});
                        }
                        res.writeHead(200, {'Content-Type': 'image/jpeg'});
                        return res.end(data);
                    });
                }
                 //sikeres beolvasás
                 res.writeHead(200, {'Content-Type': 'image/jpeg'});
                 return res.end(data);
            });
        } else {
            //nincs útvonal
            return res.status(400).send({message:'hiányzó imageName attribútum!'})
        }
    });

}

module.exports = attachEndpoints;