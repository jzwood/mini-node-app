var http = require("http");
var url = require("url");

var port = Number(process.env.PORT || 3000);

function start(route, handle){
  function onRequest(request, response) {
    var postData = "";
    var pathname = url.parse(request.url).pathname;
    // console.log("Request for " + pathname + " received.");

    request.setEncoding("utf8");

    request.addListener("data", function(dataPacket) {
      postData += dataPacket;
      console.log("Received POST data \'", dataPacket, "\'.");
    });

    request.addListener("end", function() {
      route(handle, pathname, request, response, postData);
    });

  }

  http.createServer(onRequest).listen(port);
  console.log("Server has started on port",port);
}

exports.start = start;
