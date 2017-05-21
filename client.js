var restify = require('restify');
var fs = require('fs');

// Create client
var client = restify.createJsonClient({
    url: 'http://localhost:8080',
    version: '*'
});

var fileStream = fs.createReadStream('./joomla.png', 'binary');

// Read file
fileStream.on('data', function (data) {
    client.post('/upload', {data}, function (err, req, res, obj) {
        if (err) {
            return err;
        }

        console.log(res.body)
    })
});