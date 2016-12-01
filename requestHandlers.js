var querystring = require('querystring');
var people = require("./people_without_smiles");

function start(request, response) {


    response.writeHead(200, {"Content-Type": "text/html"});
    //response.write();
    response.end(JSON.stringify(people));
}

function upload(request, response) {

     var queryData = "";

    request.on('data', function(data) {
        queryData += data;
    });




    request.on('end', function() {
        var obj = JSON.stringify(queryData);
        console.log(queryData);
        // response.write(JSON.stringify(postData));
        // response.writeHead(413, {'Content-Type': 'application/json'});
        // response.end();
    });
}

exports.start = start;
exports.upload = upload;