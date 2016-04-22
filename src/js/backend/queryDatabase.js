//makes sqlite data queries
var sqlite3 = require('sqlite3').verbose();

function loginUser(db_path, login, pwhash, rejectText, acceptText, callback) {

  var db = new sqlite3.Database(db_path);

  var context = {"heading":"ASYNC ISSUES"};//default

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
        context["heading"] = acceptText;
        context["login"] = login;
        context["pw"] = pwhash;
      } else {
        context["heading"] = rejectText;
      }
    });
  });

  db.close(function() {
    console.log('loading page');
    callback(context);
  });
}

function registerNewUser(db_path, login, pwhash, rejectText, acceptText, callback) {

  var db = new sqlite3.Database(db_path);

  var context = {"heading":"ASYNC ISSUES"};//default

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
        context["heading"] = acceptText;
        context["login"] = login;
        context["pw"] = pwhash;
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
