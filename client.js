var restify = require('restify');
var fs = require('fs');

// Create client
var client = restify.createJsonClient({
    url: 'http://localhost:8080',
    version: '*'
});

var imagepath = process.argv[2];

if (imagepath === undefined) {
    console.log('Please provide a path to a image as first argument');
} else {
    var fileStream = fs.createReadStream(imagepath, 'binary');

    // Read file
    var imageData = '';

    fileStream.on('data', function (data) {
        imageData += data;
    });

    fileStream.on('end', function () {
        client.post('/upload', { imageData }, function (err, req, res, obj) {
            if (err) {
                console.log(err.message)
            }

            fs.writeFile('./images/new.png', obj, { encoding: 'base64' }, function (err) {
                if (err) throw err;
            });
        })
    });
}