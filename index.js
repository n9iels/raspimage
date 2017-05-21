var restify = require('restify');
var fs = require('fs')

// Create server
var server = restify.createServer({ name: 'Raspberry Pi Image Service' });

// Append Middleware
server.use(restify.gzipResponse());
server.use(restify.bodyParser({
    uploadDir: './tmp',
    multiples: true
}));

server.post('/upload', function (req, res, next) {
    fs.writeFile('new.png', req.body.data, 'binary', function (err) {
        if (err) {
            console.log(err);
        }

        res.send('done!')
    })
});

server.listen(8080);