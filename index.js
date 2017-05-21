var restify = require('restify');
var fs = require('fs')
var Jimp = require("jimp");

// Create server
var server = restify.createServer({ name: 'Raspberry Pi Image Service' });

// Append Middleware
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

server.post('/upload', function (req, res, next) {
    fs.writeFile('./tmp/new.png', req.body.data, 'binary', function (err) {
        if (err) throw err;

        Jimp.read('./tmp/new.png', function(err, image) {
            if (err) throw err;

            image.grayscale().rotate(90).write('./images/new.png');
        }).then(res.send('done'))
    });
});

server.listen(8080);