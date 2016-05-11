/*
This is where the the node app starts.
*/

var server = require("./src/js/backend/server"),
router = require("./src/js/backend/router"),
loader = require('./loadFile'),
requestHandlers = require("./src/js/backend/requestHandlers")

/*
  CAN EDIT HANDLE KEY/VALUES
  The Handle obj is the C in the MVC model, i.e. the controller.
*/
var handle = {} //add custom page loads to handle here
handle["/"] = requestHandlers.home
handle["/signIn"] = requestHandlers.sign_in
handle["/signUp"] = requestHandlers.sign_up

//for images and css etc (don't edit, works automatically)
handle["load-resource"] = loader.loadResource

server.start(router.route, handle)
