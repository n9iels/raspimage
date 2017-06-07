var restify = require('restify');
var fs = require('fs');
var fileHelper = require('./helpers/file')

// Create client
var client = restify.createJsonClient({
    url: 'http://84.84.245.29:1686',
    version: '*'
});

function postImage(imageData, file, cb) {
    client.post('/upload', { imageData }, function(err, req, res, obj) {
        if (err) throw err;

        if (obj.buff.data != undefined) {
            fs.writeFile('./images/' + file + 'new.png', new Buffer(obj.buff.data), { encoding: 'binary' }, function(err) {
                if (err) throw err;

                // Write to CSV file
                var format = file.split('.')[0];

                fs.appendFile('results.csv', format + ';' + (obj.time[0] + (obj.time[1] / 1000000000)) + "\n", function(err) {
                    if (err) throw err;
                });
            });
        } else {
            // Write to CSV file
            var format = file.split('.')[0];

            fs.appendFile('results.csv', format + ', NOT FINISHED\n', function(err) {
                if (err) throw err;
            });
        }

        cb();
    });
}

//var imagepath = process.argv[2];
var imagepath = "images/todo";


var items = fs.readdirSync(imagepath);
var execute = function(count) {
    if (count < items.length) {
        var file = items[count];
        console.log("processing: " + file);
        return fileHelper.imageToFilestream(imagepath + "/" + file).then((imageData) => postImage(imageData, file, () => execute(count + 1)))
    }
}

execute(0);

