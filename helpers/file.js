var fs = require('fs');

class FileHelper {
    imageToFilestream(imagepath) {
        return new Promise(function (resolve, reject) {
            var fileStream = fs.createReadStream(imagepath, 'binary');

            // Read file
            var imageData = '';

            fileStream.on('data', function (data) {
                imageData += data;
            });

            fileStream.on('end', () => { console.log('second'); resolve(imageData); });
            fileStream.on('error', (err) => reject(err))
        });
    }

    writeFileAsync(name, data) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(name, data, 'binary', function (err) {
                if (err) {
                    reject(err)
                }

                resolve();
            });
        });
    }

    ForEachItemInDirectory(path, cb) {
        var items = fs.readdirSync(path);

        var execute = function (count) {
            if (count < items.length) {
                cb(items[count]).then(execute(count + 1))
            }
        }

        execute(0);
    }
}

module.exports = new FileHelper();