/*
performs sqlite data queries and sets cookies from callbacks
*/
var sqlite3 = require('sqlite3').verbose(),
sha1 = require('sha1')//for 1 way hash encryptions // let ct = sha1("message")

var home = 'home.hbs',
db_path = './src/js/backend/database/appUserData'

//return true if any characters common to XSS attacks are present in input
function detectXSSattack(str) {
  var badchs = /<|>|'|"|\\|\//
  return badchs.test(str)
}

function registerUser(req, res, login, pt_pw, success, failure, onFinish) {
  if (login && pt_pw) {
    if (detectXSSattack(login) || detectXSSattack(pt_pw)) {
      failure("XSS attack detected!")
    } else {

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
            failure("User already registered.")
          } else {
            var date = new Date().toLocaleDateString()
            stmt.run(login, ct_pw, date)
            stmt.finalize()
            // setLoginCookies(res,req,login,ct_pw)
            success("Successfully registered", login)
          }
        })
      })
      db.close(onFinish)
    }
  } else {
    failure("Form improperly filled out")
  }
}

function loginUser(req, res, login, pt_pw, success, failure, onFinish) {
  if (login && pt_pw) {
    if (detectXSSattack(login) || detectXSSattack(pt_pw)) {
      failure("XSS attack detected!")
    } else {

      var ct_pw = sha1(String(pt_pw.trim()))
      login = String(login).trim()

      var db = new sqlite3.Database(db_path)
      db.serialize(function() {
        db.run("CREATE TABLE if not exists user_info (name TEXT, pwhash TEXT, date TEXT)");
        var date = new Date().toLocaleDateString();
        db.run("UPDATE user_info SET date = '" + date +
        "' WHERE name = '" + login + "' AND pwhash = '" + ct_pw +
        "' AND date != '" + date + "'");
        db.get("SELECT name, pwhash FROM user_info WHERE name = '" + login +
        "' AND pwhash = '" + ct_pw + "'",
        function(err, user) {
          if (err) throw err
          if (user) {
            //setLoginCookies(res,req,login,ct_pw)
            success("Successfully logged in " + user.name)
          } else {
            failure("Incorrect name/password")
          }
        })
      })
      db.close(onFinish)
    }
  }else{
    failure("Form improperly filled out.")
  }
}

exports.register = registerUser
exports.login = loginUser
