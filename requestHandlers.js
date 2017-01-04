var fs = require('fs');
var querystring = require('querystring');
var StorageTable = require('./js/StorageTable.js');

var peopleManager = new StorageTable("people");
var categoriesManager = new StorageTable("categories");
var smilesManager = new StorageTable("smiles");




function test(request, response) {
    var queryData = "";

    request.on('data', function (data) {
        queryData += data;
    });

    request.on('end', function () {
        var postData = querystring.parse(queryData);

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(postData));
    });
}

//PEOPLE
exports.getPeople = function (request, response) {
    var data = peopleManager.getAll();

    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(data);
};

exports.updatePeople = function (request, response) {
    var queryData = "";

    request.on('data', function (data) {
        queryData += data;
    });

    request.on('end', function () {
        var postData = JSON.parse(queryData);

        peopleManager.update(postData);

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end();

        for (var key in clients) {
            clients[key].send("People updated");
        }
    });
};

exports.removePeople = function (request, response, personId) {

    request.on('data', function (data) {

    });

    request.on('end', function () {
        peopleManager.remove(personId);

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({result: "ok"}));

        for (var key in clients) {
            clients[key].send("People updated");
        }
    });
};

//CATEGORIES
exports.getAllCategories = function (request, response) {
    var data = categoriesManager.getAll();

    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(data);
};

//SMILES
exports.getAllSmiles = function (request, response) {
    var data = smilesManager.getAll();

    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(data);
};

exports.addSmiles = function (request, response) {
    var queryData = "";

    request.on('data', function (data) {
        queryData += data;
    });

    request.on('end', function () {
        var postData = JSON.parse(queryData);

        postData.forEach(function (smile) {
            smile.time = new Date().getTime();
        });

        smilesManager.insert(postData);

        for (var key in clients) {
            clients[key].send("Smiles updated");
            //clients[key].send({
            //    action : "update",
            //    updated: "smiles"
            //});
        }

        //clientNotifier.updated("smiles");

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(); //TODO: Send only updated part and process it on client
    });
};

exports.removeSmile = function (request, response, smileId) {
    var queryData = "";

    request.on('data', function (data) {
        //Left empty
    });

    request.on('end', function () {
        console.log("Smile id", smileId);
        smilesManager.remove(smileId);

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end();

        for (var key in clients) {
            clients[key].send("Smiles updated");
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


//TODO: Move WebSocket to separate file
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