/*
this is where the magic starts. 'npm start'
*/

var server = require("./backend/server");
var router = require("./backend/router");

var requestHandlers = require("./backend/requestHandlers");

var handle = {};//add custom page loads to handle here
handle["/"] = requestHandlers.home;
// handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/signIn"] = requestHandlers.sign_in;
handle["/signUp"] = requestHandlers.sign_up;

//for images and css etc (don't edit, works automatically)
handle["load-resource"] = requestHandlers.loadResource;

server.start(router.route, handle);
