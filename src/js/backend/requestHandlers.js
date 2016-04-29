/*
requestHandlers contains only the unique content for each page.
*/

var querystring = require('querystring'),
loader = require('./loadFile'),
queryDB = require('./queryDatabase'),
cookies = require('./handleCookies'),
sha1 = require('sha1'); //for 1 way hash encryptions // let ct = sha1("message");

var tempPath = '/src/templates/',
loginPath = '/src/templates/login.hbs';

function homeGate(response, postData) {
  var id = cookies.getCookie('id');

  var context = {
    "heading": "Hi. Who are you?"
  };

  loader.loadHTML(response, loginPath, context);
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
    queryDB.authenticate(login, secure_pw, reject, accept, function(context,tempName){
      loader.loadHTML(response, tempPath + tempName, context);
    });

  } else {
    context = {"heading":"Fill out the whole form"};
    loader.loadHTML(response, loginPath, context);
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
    queryDB.register(login, secure_pw, reject, accept, function(context){
      loader.loadHTML(response, loginPath, context);
    });

  } else {
    context = {"heading":"Fill out the whole form"};
    loader.loadHTML(response, loginPath, context);
  }
}

exports.home_gate = homeGate;
exports.sign_in = signIn;
exports.sign_up = signUp;
exports.loadResource = loader.loadResource;
