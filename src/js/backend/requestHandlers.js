/*
requestHandlers contains only the unique content for each page.
*/

var querystring = require("querystring"),
loader = require("./loadFile"),
queryDB = require('./queryDatabase'),
sha1 = require('sha1'); //for 1 way hash encryptions // let ct = sha1("message");

var database = './src/js/backend/database/appUserData';
var templatePath = '/src/templates/body.hbs';


function home(response, postData) {

  var context = {
    "heading": "Hi. Who are you?"
  };

  loader.loadHTML(response, templatePath, context);
}

function signIn(response, postData) {

  var dataObj = querystring.parse(postData);
  var login = dataObj.login,  pw = dataObj.pw;

  if (login && pw) {
    var secure_pw = sha1(String(pw.trim())),
    login = String(login).trim();

    var reject = "This name/password is incorrect.",
    accept = "Access approved.";
    //check db if name exists, if not inserts login and encrypted password
    queryDB.authenticate(database, login, secure_pw, reject, accept, function(context){
      loader.loadHTML(response, templatePath, context);
    });

  } else {
    context = {"heading":"Fill out the whole form"};
    loader.loadHTML(response, templatePath, context);
  }
}

function signUp(response, postData) {

  var dataObj = querystring.parse(postData);
  var login = dataObj.login,  pw = dataObj.pw;

  if (login && pw) {
    var secure_pw = sha1(String(pw.trim())),
    login = String(login).trim();

    var reject = "This name is already known to us.",
    accept = "You are one of us now.";
    //check db if name exists, if not inserts login and encrypted password
    queryDB.register(database, login, secure_pw, reject, accept, function(context){
      loader.loadHTML(response, templatePath, context);
    });

  } else {
    context = {"heading":"Fill out the whole form"};
    loader.loadHTML(response, templatePath, context);
  }
}

function upload(response, postData) {
  //console.log("Request handler 'upload' was called.");
  // response.writeHead(200, {"Content-Type": "text/plain"});
  // response.write("You've sent the text: "+ postData);//querystring.parse(postData).text);
  // response.end();
  start(response, postData);
}

exports.home = home;
exports.sign_in = signIn;
exports.sign_up = signUp;
exports.upload = upload;
exports.loadResource = loader.loadResource;
