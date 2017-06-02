var restify = require('restify');
var fs = require('fs')
var Jimp = require("jimp");
var randomstring = require("randomstring");

// Create server
var server = restify.createServer({ name: 'Raspberry Pi Image Service' });

// Append Middleware
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

// Write to a file async
function writeFile(name, data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(name, data, 'binary', function (err) {
            if (err) {
                reject(err)
            }

            resolve();
        });
    });
}

function editImage(image) {
    return new Promise(function (resolve, reject) {
        //image.grayscale().rotate(90).write('./images/new.png', resolve())
        image.grayscale().rotate(90).getBuffer(Jimp.MIME_PNG, function (err, buff) {
            if (err) {
                reject(err);
            }

            resolve(buff);
        })
    });
}

// Routes
server.post('/upload', function (req, res, next) {
    console.time('execution');
    var randomName = randomstring.generate();

    writeFile('./tmp/' + randomName + '.png', req.body.imageData).then(function () {
        Jimp.read('./tmp/' + randomName + '.png')
            .then((image) => editImage(image)
                .then(console.timeEnd('execution'))
                .then((buff) => res.send(buff))
                .catch((err) => res.send(err, 500)))
            .catch((err) => res.send(err, 500));
    }).catch((err) => res.send(err, 500));
});

server.listen(8080);