/*
requestHandlers contains only the unique content for each page.
*/

var querystring = require('querystring'),
loader = require('./loadFile'),
queryDB = require('./queryDatabase'),
Cookies = require('cookies'),
Keygrip = require("keygrip"),
sha1 = require('sha1'); //for 1 way hash encryptions // let ct = sha1("message");

var tempPath = '/src/templates/',
loginPath = '/src/templates/login.hbs',
keylist = ["du283ikf84ygdjw","18396o7fhsgsujwn5i","101i3n3nbzxqwm"],//these are random
keys = Keygrip(keylist);

function home(req, res){
  var cookies = new Cookies( req, res, { "keys": keys } ),
  user = cookies.get("uId", { signed: true, httpOnly: true } );
  credentials = cookies.get("uAuth", { signed: true, httpOnly: true } );
  if(user && credentials){

  }
}

function homeGate(request, response, postData) {

  var cookies = new Cookies( request, response, { "keys": keys } );
  //ulc = user login credentials
  var access_code = cookies.get("loginCredentials", { signed: true, httpOnly: true } )
  // cookies.set( "loginCredentials", "some vale here!", { signed: true, httpOnly: true } )
  console.log('the cookie is: ', access_code);
  var context = {
    "heading": "Hi. Who are you?"
  };

  loader.loadHTML(response, loginPath, context);
}

function signIn(request, response, postData) {

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

function signUp(request, response, postData) {

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

exports.home = home;
exports.home_gate = homeGate;
exports.sign_in = signIn;
exports.sign_up = signUp;
exports.loadResource = loader.loadResource;
