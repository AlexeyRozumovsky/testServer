var fs = require('fs'),
    querystring = require('querystring'),
    StorageTable = require('./js/StorageTable.js'),
    peopleManager = new StorageTable("people"),
    categoriesManager = new StorageTable("categories"),
    smilesManager = new StorageTable("smiles");

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

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(); //TODO: Send only updated part and process it on client
    });
};

exports.removeSmile = function (request, response, smileId) {

    request.on('data', function (data) {
        //Left empty
    });

    request.on('end', function () {
        smilesManager.remove(smileId);

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end();
    });
};

exports.login = function (request, response) {
    var queryData = "";

    request.on('data', function (data) {
        queryData += data;
    });

    request.on('end', function () {
        var postData = JSON.parse(queryData);


        //if (postData.name === "lix" && postData.password === "qq") {
            //response.setHeader("Set-Cookie", ["SESSID=123123333"])
            response.cookie("name", "vova", {httpOnly: true});
            response.writeHead(200, {'Content-Type': 'application/json'});
            console.log("ok");
       //} else {
        //    response.writeHead(200, {'Content-Type': 'application/json'});
        //}


        response.end();
    });
};

exports.test = test;
