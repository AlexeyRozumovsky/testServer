var fs = require('fs');
var querystring = require('querystring');

function test(request, response) {
    var queryData = "";

    request.on('data', function (data) {
        queryData += data;
    });

    request.on('end', function () {
        var postData = querystring.parse(queryData);
        console.log(postData);

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(postData));
    });
}

//PEOPLE
exports.getPeople = function (request, response) {
    var people = readJSON("people");

    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(people));
};

exports.updatePeople = function (request, response) {
    var people = readJSON("people"),
        queryData = "";

    request.on('data', function (data) {
        queryData += data;
    });

    request.on('end', function () {
        var postData = querystring.parse(queryData),
            curPerson = {},
            dataChanged = false;

        people.forEach(function (person) {
            if (person.id == postData.id) {
                if (postData.name && postData.name.length > 3) {
                    person.name = postData.name;
                }
                if (postData.photo && postData.photo.length > 10) {
                    person.photo = postData.photo;
                }
                curPerson = person;
                dataChanged = true;
            }
        });

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(curPerson));

        if (dataChanged) {
            writeJSON("people", people);

            for (var key in clients) {
                clients[key].send("PERSON #" + curPerson.id + " was updated");
            }
        }
    });

};

exports.removePeople = function (request, response, personId) {
    var people = readJSON("people"),
        queryData = "";

    request.on('data', function (data) {
        queryData += data;
    });

    request.on('end', function () {
        var postData = querystring.parse(queryData),
            curPerson = {},
            dataChanged = false;

        console.log("postData", postData);
        people.forEach(function (person, index) {
            if (person.id == personId) {

                people.splice(index, 1);
                dataChanged = true;
            }
        });

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({result: "ok"}));

        if (dataChanged) {
            writeJSON("people", people);
        }
    });
};

//CATEGORIES
exports.getAllCategories = function (request, response) {
    var categories = readJSON("categories");

    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(categories));
};


//SMILES
exports.getAllSmiles = function (request, response) {
    var smilesConfig = readJSON("smiles");

    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(smilesConfig.smiles));
};

exports.addSmiles = function (request, response) {
    var smilesConfig = readJSON("smiles"),
        queryData = "";

    request.on('data', function (data) {
        queryData += data;
    });

    request.on('end', function () {
        var postData = JSON.parse(queryData),
            autoIncrement = smilesConfig.settings.autoIncrement;

        postData.forEach(function (smile) {
            smile.id = ++autoIncrement;
            smile.time = new Date().getTime();
        });

        smilesConfig.settings.autoIncrement = autoIncrement;
        smilesConfig.smiles = smilesConfig.smiles.concat(postData);
        writeJSON("smiles", smilesConfig);

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(smilesConfig.smiles)); //TODO: Do we need to get all smiles back?

    });
};

exports.removeSmile = function (request, response, smileId) {
    var smilesConfig = readJSON("smiles"),
        smiles = smilesConfig.smiles,
        queryData = "";

    request.on('data', function (data) {
        //Left empty
    });

    request.on('end', function () {
        var dataChanged = false;

        smiles.forEach(function (smile, index) {
            if (smile.id == smileId) {

                smiles.splice(index, 1);
                dataChanged = true;
            }
        });

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(smiles));

        if (dataChanged) {
            writeJSON("smiles", smilesConfig);
        }
    });
};


function readJSON(path) {
    return JSON.parse(fs.readFileSync("db/" + path + ".json", 'utf8'));
}

function writeJSON(path, content) {
    fs.writeFile("db/" + path + ".json", JSON.stringify(content, null, 4));
}

exports.test = test;
//exports.start = start;


var WebSocketServer = new require('ws');

// подключенные клиенты
var clients = {};

// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({
    port: 8081
});


webSocketServer.on('connection', function (ws) {

    var id = Math.random();
    clients[id] = ws;
    console.log("новое соединение " + id);

    ws.on('message', function (message) {
        console.log('получено сообщение ' + message);

        for (var key in clients) {
            clients[key].send(message);
        }
    });

    ws.on('close', function () {
        console.log('соединение закрыто ' + id);
        delete clients[id];
    });

});