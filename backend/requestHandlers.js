/*
  requestHandlers contains only the unique content for each page.
  path to .hbs file plus data
*/

var querystring = require("querystring"),
    loader = require("./loadFile"),
    sha1 = require('sha1');//for 1 way hash encryptions // let ct = sha1("message");

// function home(response, postData){
//
// }

function start(response, postData) {

  var context = {title: "My New Post", posted: postData};
  loader.loadHTML(response,'/templates/body.hbs',context);

}

function upload(response, postData){
  // console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("You've sent the text: "+ querystring.parse(postData).text);
  response.end();
  // start(response,querystring.parse(postData).text);

}

exports.home = start;
exports.start = start;
exports.upload = upload;
exports.loadResource = loader.loadResource;
