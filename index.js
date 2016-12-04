var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/test"] = requestHandlers.test;
handle["/get/people"] = requestHandlers.getPeople;
handle["/update/people"] = requestHandlers.updatePeople;
handle["/remove/people"] = requestHandlers.removePeople;


server.startServer(router.route, handle);