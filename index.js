/*
this is where the magic starts. 'npm start' 
*/

var server = require("./server");
var router = require("./router");

var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

//for images and css etc
handle["load-resource"] = requestHandlers.loadResource;

server.start(router.route, handle);
