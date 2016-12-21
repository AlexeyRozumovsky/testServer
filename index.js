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

// /* serves main page */
// app.get("/", function (req, res) {
//     res.sendfile('index.htm')
// });
//
// app.post("/user/add", function (req, res) {
//     /* some server side logic */
//     res.send("OK");
// });
//
// /* serves all the static files */
// app.get(/^(.+)$/, function (req, res) {
//     console.log('static file request : ' + req.params);
//     res.sendfile(__dirname + req.params[0]);
// });


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


app.listen(port, function () {
    console.log("Listening on " + port);
});


