/*
requestHandlers contains endpoints for urls specified in index.js and define the
content for each page
*/

var querystring = require('querystring'),
loader = require('./loadFile'),
queryDB = require('./queryDatabase'),
cookieUtils = require('./cookieUtils')

var tempPath = '/src/templates/',
loginPath = '/src/templates/login.hbs',
homepagePath = '/src/templates/home.hbs'

//helper function: tests login authentication for a given username and password
//loads homepage on success, login page on failure
function dbLogin(req, res, login, pw, useCookies){
  queryDB.login(req, res, login, pw, useCookies, function(success_msg, ct_pw){
		cookieUtils.setLoginCookies(req,res, login, ct_pw)
    var context = {
      "heading" : success_msg,
      "login" : login,
      "pw" : ct_pw
    }
    loader.loadHTML(res, homepagePath, context)
  }, function(failure_msg){
    var context = {
      "heading" : failure_msg
    }
    loader.loadHTML(res, loginPath, context)
  }, function(){
    console.log("database sign-up query completed")
  })
}

//homepage first attempts to authenticate user by pinging db with server-side
//cookies. Successful authentication leads to home page and failure directs to
//homegate page
function homePage(req, res){

  var loginCookies = cookieUtils.getLoginCookies(req, res)
  if (loginCookies.uId && loginCookies.uAuth){
    dbLogin(req, res, loginCookies.uId, loginCookies.uAuth, useCookies=true)
  }else{
    console.log("Cookie authentication failed: no cookies set")
    loader.loadHTML(res, loginPath, {
			"heading" : "Hi and welcome"
		})
  }
}

//for accessing the homepage through the homegate form
function signIn(req, res, data) {
  //extract form data
  var dataObj = querystring.parse(data),
  login = dataObj.login,  pw = dataObj.pw
  //attempt to sign in registered user
  dbLogin(req, res, login, pw)
}

//for registering a new user in the app database and setting
//authentication cookies in client browser through the the homegate form
function signUp(req, res, data) {
  //extract form data
  var dataObj = querystring.parse(data),
  login = dataObj.login,  pw = dataObj.pw
  //attempt to register new user
  queryDB.register(req, res, login, pw,
    function(success_msg, ct_pw){
			// cookieUtils.setLoginCookies(req, res, login, ct_pw) //this step will happen at login
      var context = {
        "heading" : success_msg,
        "login" : login,
        "pw" : ct_pw
      }
      loader.loadHTML(res, loginPath, context)
  }, function(failure_msg){
    var context = {
      "heading" : failure_msg
    }
    loader.loadHTML(res, loginPath, context)
  }, function(){
    console.log("database registration completed")
  })
}

exports.home_page = homePage
exports.sign_in = signIn
exports.sign_up = signUp
