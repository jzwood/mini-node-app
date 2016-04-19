var http = require("http");
var url = require("url");
// var sha1 = require('sha1');//for 1 way hash encryptions // let ct = sha1("message");

function start(route, handle){
  function onRequest(request, response) {
    var postData = "";
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    request.setEncoding("utf8");

    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      //console.log("Received POST data chunk '"+ postDataChunk + "'.");
    });

    request.addListener("end", function() {
      route(handle, pathname, response, postData);
    });

  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");//,"encrypted",sha1("message"));
}

exports.start = start;
