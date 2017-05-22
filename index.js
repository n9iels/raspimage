var restify = require('restify');
var fs = require('fs')
var Jimp = require("jimp");

// Create server
var server = restify.createServer({ name: 'Raspberry Pi Image Service' });

// Append Middleware
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

// Write to a file async
function writeFile(name, data) {
    return new Promise(function(resolve, reject) {
        fs.writeFile('./tmp/new.png', data, 'binary', function (err) {
            if (err) {
                reject(err)
            }

            resolve();
        });
    });
}

function editImage(image) {
    return new Promise(function(resolve, reject) {
        image.grayscale().rotate(90).write('./images/new.png', resolve())
    });
}

// Routes
server.post('/upload', function (req, res, next) {
    writeFile('./tmp/new.png', req.body.imageData).then(function() {
        Jimp.read('./tmp/new.png').then((image) => editImage(image).then(res.send('done')))
    });
});

server.listen(8080);