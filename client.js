var restify = require('restify');
var fs = require('fs');

// Create client
var client = restify.createJsonClient({
    url: 'http://localhost:8080',
    version: '*'
});

var fileStream = fs.createReadStream('./images/xbox.png', 'binary');

// Read file
var imageData = '';

fileStream.on('data', function (data) {
    imageData += data;
});

fileStream.on('end', function () {
    client.post('/upload', { imageData }, function (err, req, res, obj) {
        if (err) {
            console.log(err)
        }

        console.log(res.body)
    })
});