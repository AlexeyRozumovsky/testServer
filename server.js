var http = require("http");
var url = require("url");

function startServer(route, handle) {

    http.createServer(function (request, response) {
        var pathName = url.parse(request.url).pathname;



        route(handle, pathName, request, response);

        // response.writeHead(200, {"content-Type": "text/plain"});
        // response.write(content);
        // response.end();
    }).listen(8888);

    console.log("Server been has started.");
}

exports.startServer = startServer;