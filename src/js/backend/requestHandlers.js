/*
requestHandlers contains endpoints for urls specified in index.js and define the
content for each page
*/

var querystring = require('querystring'),
loader = require('./loadFile'),
queryDB = require('./queryDatabase'),
Cookies = require('cookies'),
Keygrip = require('keygrip'),
sha1 = require('sha1') //for 1 way hash encryptions // let ct = sha1("message")

var tempPath = '/src/templates/',
loginPath = '/src/templates/login.hbs',
homepagePath = '/src/templates/home.hbs'


//helper function: tests login authentication for a given username and password
//loads homepage on success, login page on failure
function dbLogin(req,res,login,pw){
  queryDB.login(req, res, login, pw, function(success_msg){
    var context = {
      "heading" : success_msg,
      "login" : login,
      "pw" : "********"
    }
    loader.loadHTML(res, homepagePath, context)
  }, function(failure_msg){
    var context = {
      "heading" : failure_msg
    }
    loader.loadHTML(res, loginPath, context)
  }, function(){
    console.log("db connection closed")
  })
}

//homepage first attempts to authenticate user by pinging db with server-side
//cookies. Successful authentication leads to home page and failure directs to
//homegate page
function homePage(req, res){

  var getLoginCookies = function(){
    var keys = Keygrip(["du283ikf84ygdjw","18396o7fhsgsujwn5i","101i3n3nbzxqwm"])//these are random
    var cookies = new Cookies( req, res, { "keys": keys } ),
    user = cookies.get("uId", { signed: true, httpOnly: true } ),
    credentials = cookies.get("uAuth", { signed: true, httpOnly: true } )
    return {"uId": user, "uAuth": credentials}
  }

  var loginCookies = getLoginCookies()
  if (loginCookies.uId && loginCookies.uAuth){
    dbLogin(request, response, login, pw)
  }else{
    console.log("Cookie authentication failed: no cookies set")
    loader.loadHTML(response, loginPath, context)
  }
}

//for accessing the homepage through the homegate form
function signIn(req, res, data) {
  //extract form data
  var dataObj = querystring.parse(data),
  login = dataObj.login,  pw = dataObj.pw
  //attempt to sign in registered user
  dbLogin(request, response, login, pw)
}

//for registering a new user in the app database and setting
//authentication cookies in client browser through the the homegate form
function signUp(req, res, data) {
  //extract form data
  var dataObj = querystring.parse(data),
  login = dataObj.login,  pw = dataObj.pw
  //attempt to register new user
  db.register(req, res, login, pw,
    function(success_msg){
      var context = {
        "heading" : success_msg,
        "login" : login,
        "pw" : "********"
      }
      loader.loadHTML(res, loginPath, context)
  }, function(failure_msg){
    var context = {
      "heading" : failure_msg
    }
    loader.loadHTML(res, loginPath, context)
  }, function(){
    console.log("db connection closed")
  })
}

exports.home_page = homePage
exports.sign_in = signIn
exports.sign_up = signUp
exports.loadResource = loader.loadResource
