var fs = require('fs');

exports.readJSON = function (path) {
    var json = JSON.parse(fs.readFileSync("db/" + path + ".json", 'utf8'))

    return json;
};

exports.writeJSON = function (path, content) {
    fs.writeFileSync("db/" + path + ".json", JSON.stringify(content, null, 4));
};

exports.readJsonAsync = function (path) {
    return new Promise(function (resolve, reject) {
        fs.readFile("db/" + path + ".json", function (err, data) {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
};