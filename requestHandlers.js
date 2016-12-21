var fs = require('fs');
var querystring = require('querystring');
var people = require("./people_without_smiles");

function start(request, response) {


    response.writeHead(200, {"Content-Type": "text/html"});
    //response.write();
    response.end(JSON.stringify(people));
}

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

function getPeople(request, response) {
    var people = readJSON("people");

    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(people));

}

function updatePeople(request, response) {
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

}

function removePeople(request, response) {
    var people = readJSON("people"),
        queryData = "";

    request.on('data', function (data) {
        queryData += data;
    });

    request.on('end', function () {
        var postData = querystring.parse(queryData),
            curPerson = {},
            dataChanged = false;

        console.log("postdata: ", postData);

        people.forEach(function (person, index) {
            if (person.id == postData.id) {

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

}


function upload(request, response) {

    var queryData = "";

    request.on('data', function (data) {
        queryData += data;
    });


    request.on('end', function () {
        var obj = querystring.parse(queryData);
        console.log(obj);
        // response.write(JSON.stringify(postData));
        // response.writeHead(413, {'Content-Type': 'application/json'});
        // response.end();
    });
}


function readJSON(path) {
    return JSON.parse(fs.readFileSync("db/" + path + ".json", 'utf8'));
}

function writeJSON(path, content) {
    fs.writeFile("db/" + path + ".json", JSON.stringify(content, null, 4));
}

exports.test = test;
exports.start = start;
exports.upload = upload;
exports.getPeople = getPeople;
exports.updatePeople = updatePeople;
exports.removePeople = removePeople;


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