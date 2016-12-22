// var server = require("./server");
// var router = require("./router");
// var requestHandlers = require("./requestHandlers");
//
// var handle = {};
// handle["/"] = requestHandlers.start;
// handle["/start"] = requestHandlers.start;
// handle["/upload"] = requestHandlers.upload;
// handle["/test"] = requestHandlers.test;
// handle["/get/people"] = requestHandlers.getPeople;
// handle["/update/people"] = requestHandlers.updatePeople;
// handle["/remove/people"] = requestHandlers.removePeople;
//
//
// server.startServer(router.route, handle);


var express = require("express"),
    app = express(),
    port = 5000,
    requestHandlers = require("./requestHandlers");


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//TODO: How to make router which depends on url?

app.get("/remove/people/:id", function (req, res) {
    var personId = req.params.id;
    requestHandlers.removePeople(req, res, personId)
});

app.get("/people", function (req, res) {
    requestHandlers.getPeople(req, res);
});

app.get("/categories", function (req, res) {
    requestHandlers.getAllCategories(req, res);
});

app.get("/smiles", function (req, res) {
    requestHandlers.getAllSmiles(req, res);
});

app.get("/remove/smile/:id", function (req, res) {
    var smileId = req.params.id;

    requestHandlers.removeSmile(req, res, smileId)
});

app.post("/addSmiles", function (req, res) {
    requestHandlers.addSmiles(req, res);
});

app.post("/people/update", function (req, res) {
    requestHandlers.updatePeople(req, res);
});


app.listen(port, function () {
    console.log("Listening on " + port);
});


