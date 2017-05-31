var restify = require('restify');
var fs = require('fs');

// Create client
var client = restify.createJsonClient({
    url: 'http://84.84.245.29:1686',
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

        fs.writeFile('./images/new.png', obj, {encoding: 'base64'}, function(err) {
            if (err) throw err;
        });
    })
});
