//makes sqlite data queries
var sqlite3 = require('sqlite3').verbose(),
db_path = './src/js/backend/database/appUserData',
home = 'home.hbs',
sha1 = require('sha1')

function detectXSSattack(str){
  var badchs = /<|>|'|"|\\|\//
  return badchs.test(str)
}

function registerUser(login, pt_pw, success, failure, onFinish){
  if (login && pt_pw) {
    var ct_pw = sha1(String(pt_pw.trim()))
    login = String(login).trim()

    var db = new sqlite3.Database(db_path)
    db.serialize(function() {
      db.run("CREATE TABLE if not exists user_info (name TEXT, pwhash TEXT, date TEXT)");
      var stmt = db.prepare("INSERT INTO user_info VALUES (?,?,?)");
      db.get("SELECT name, pwhash, date FROM user_info WHERE name = '" + login + "'", function(err, user) {
        if (err) throw err
        if (user) {
          console.log('user is: ', user)
          failure("User already registered.");
        } else {
          var date = new Date().toLocaleDateString()
          stmt.run(login, pwhash, date)
          stmt.finalize()
          succuss()
        }
      });
    });

    db.close(onFinish();)

  }else{
    failure("Form improperly filled out.");
  }
}

function isRegesteredUser(login, encr_pw, success, failure){

}

function loginUser(login, pwhash, rejectText, acceptText, callback) {

  var db = new sqlite3.Database(db_path),
  context = {"heading":"ASYNC ISSUES"};//default

  var path;

  db.serialize(function() {
    db.run("CREATE TABLE if not exists user_info (name TEXT, pwhash TEXT, date TEXT)");
    var date = new Date().toLocaleDateString();
    db.run("UPDATE user_info SET date = '" + date +
    "' WHERE name = '" + login + "' AND pwhash = '" + pwhash +
    "' AND date != '" + date + "'");
    db.get("SELECT name, pwhash FROM user_info WHERE name = '" + login +
    "' AND pwhash = '" + pwhash + "'", function(err, user) {
      if (err) throw err;
      if (user) {
        context = {"heading" : acceptText, "login":login, "pw" : pwhash};
        path = home;
      } else {
        context["heading"] = rejectText;
        path = "login.hbs";
      }
    });
  });

  db.close(function() {
    console.log('loading page');
    callback(context, path);
  });
}

function registerNewUser(login, pwhash, rejectText, acceptText, callback) {

  var db = new sqlite3.Database(db_path),
  context = {"heading":"ASYNC ISSUES"};//default

  db.serialize(function() {
    db.run("CREATE TABLE if not exists user_info (name TEXT, pwhash TEXT, date TEXT)");
    var stmt = db.prepare("INSERT INTO user_info VALUES (?,?,?)");
    db.get("SELECT name, pwhash, date FROM user_info WHERE name = '" + login + "'", function(err, user) {
      if (err) throw err;
      if (user) {
        console.log('user is: ', user);
        context["heading"] = rejectText;
      } else {
        var date = new Date().toLocaleDateString();
        stmt.run(login, pwhash, date);
        stmt.finalize();
        context = {
          "heading" : acceptText,
          "login" : login,
          "pw" : pwhash
        }
      }
    });
  });

  db.close(function() {
    console.log('loading page');
    callback(context);
  });
}

exports.register = registerNewUser;
exports.authenticate = loginUser;
