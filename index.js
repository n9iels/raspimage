var restify = require('restify');
var fs = require('fs')
var Jimp = require("jimp");
var randomstring = require("randomstring");
var fileHelper = require("./helpers/file");

// Create server
var server = restify.createServer({ name: 'Raspberry Pi Image Service' });

// Append Middleware
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

function editImage(image) {
    return new Promise(function (resolve, reject) {
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
    // Create a random name for the file
    var randomName = randomstring.generate();

    fileHelper.writeFileAsync('./tmp/' + randomName + '.png', req.body.imageData).then(function () {
        // Start counting execution time after the file is stored
        var start = process.hrtime();

        Jimp.read('./tmp/' + randomName + '.png')
            .then((image) => editImage(image)
                .then(function(buff) {
                    // Image is processed, stop execution time
                    var end = process.hrtime(start);

                    res.send({"buff":buff, "time":end})
                })
                .then(fs.unlink('./tmp/' + randomName + '.png'))
                .catch((err) => res.send(err, 500)))
            .catch((err) => res.send(err, 500));
    }).catch((err) => res.send(err, 500));
});

server.listen(8080);