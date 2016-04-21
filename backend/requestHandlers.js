/*
requestHandlers contains only the unique content for each page.
path to .hbs file plus data
*/

var querystring = require("querystring"),
loader = require("./loadFile"),
sqlite3 = require('sqlite3').verbose(),
sha1 = require('sha1'); //for 1 way hash encryptions // let ct = sha1("message");


function home(response, postData) {

  var context = {
    "heading": "Hi. Who are you?"
  };

  loader.loadHTML(response, '/templates/body.hbs', context);
}

function signIn(response, postData) {

  home(response, postData);
  // var context = {"heading": heading, "login": login, "pw":secure_pw};
  // loader.loadHTML(response,'/templates/body.hbs',context);
}

function signUp(response, postData) {

  var repo = './backend/database/appUserData';
  var db = new sqlite3.Database(repo);

  var login = querystring.parse(postData).login,
  pw = querystring.parse(postData).pw;

  if (login && pw) {
    var secure_pw = sha1(String(pw.trim())),
    login = String(login).trim(),
    context = {};

    context["heading"] = "ASYN ISSUES";
    db.serialize(function() {
      db.run("CREATE TABLE if not exists user_info (name TEXT, pwhash TEXT)");
      var stmt = db.prepare("INSERT INTO user_info VALUES (?,?)");
      db.get("SELECT name, pwhash FROM user_info WHERE name = '" + login + "'", function(err, user) {
        if (err) throw err;
        console.log('user is: ',user);
        if(user){
          context["heading"] = "This name is already known to us.";
        }else{
          stmt.run(login, secure_pw);
          stmt.finalize();
          context["heading"] = "You are one of us now.";
          context["login"] = login;
          context["pw"] = secure_pw;
        }
      });
    });
    db.close(function(){
      console.log('loading page');
      loader.loadHTML(response, '/templates/body.hbs', context);
    });
    // db.each("SELECT name, pwhash FROM user_info WHERE name = 'cat' AND pwhash = '8175e3c8753aeb1696959f72ede260ebf3ea14c5'" , function(err, row) {
    //   if(err) throw err;
    //   console.log(row.name + ": " + row.pwhash, ' we got a hit! you`re in the db');
    // });

  } else {
    context["heading"] = "Fill out the whole form";
    loader.loadHTML(response, '/templates/body.hbs', context);
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
