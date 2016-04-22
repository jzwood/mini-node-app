/*
requestHandlers contains only the unique content for each page.
*/

var querystring = require("querystring"),
loader = require("./loadFile"),
queryDB = require('./queryDatabase'),
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
  var templatePath = '/templates/body.hbs';

  var dataObj = querystring.parse(postData);
  var login = dataObj.login,
  pw = dataObj.pw;

  if (login && pw) {
    var secure_pw = sha1(String(pw.trim())),
    login = String(login).trim();

    queryDB.register(repo, templatePath, login, secure_pw, response, function(res,path,ctx){
      loader.loadHTML(res, path, ctx);
    });
    // db.serialize(function() {
    //   db.run("CREATE TABLE if not exists user_info (name TEXT, pwhash TEXT)");
    //   var stmt = db.prepare("INSERT INTO user_info VALUES (?,?)");
    //   db.get("SELECT name, pwhash FROM user_info WHERE name = '" + login + "'", function(err, user) {
    //     if (err) throw err;
    //     console.log('user is: ',user);
    //     if(user){
    //       context["heading"] = "This name is already known to us.";
    //     }else{
    //       stmt.run(login, secure_pw);
    //       stmt.finalize();
    //       context["heading"] = "You are one of us now.";
    //       context["login"] = login;
    //       context["pw"] = secure_pw;
    //     }
    //   });
    // });
    // db.close(function(){
    //   console.log('loading page');
    //   loader.loadHTML(response, '/templates/body.hbs', context);
    // });

  } else {
    context["heading"] = "Fill out the whole form";
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
