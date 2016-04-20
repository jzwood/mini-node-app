/*
  requestHandlers contains only the unique content for each page.
  path to .hbs file plus data
*/

var querystring = require("querystring"),
    loader = require("./loadFile"),
    sha1 = require('sha1');//for 1 way hash encryptions // let ct = sha1("message");

function home(response, postData){

}

function start(response, postData) {

  var login = querystring.parse(postData).login,
  pw = querystring.parse(postData).pw,
  secure_pw = sha1(String(pw));
  title = ["Hi. Who are you?","Nope, can't find you."],
  heading = title[0];

  var context = {"heading": heading, "login": login, "pw":secure_pw};
  loader.loadHTML(response,'/templates/body.hbs',context);

}

function upload(response, postData){
  //console.log("Request handler 'upload' was called.");
  // response.writeHead(200, {"Content-Type": "text/plain"});
  // response.write("You've sent the text: "+ postData);//querystring.parse(postData).text);
  // response.end();
  start(response,postData);
}

exports.home = home;
exports.start = start;
exports.upload = upload;
exports.loadResource = loader.loadResource;
