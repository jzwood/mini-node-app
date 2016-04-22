//makes sqlite data queries
var sqlite3 = require('sqlite3').verbose();

function registerNewUser(repo, tempPath, login, pwhash, response, callback) {

  var db = new sqlite3.Database(repo);

  var context = {"heading":"ASYNC ISSUES"};//default

  db.serialize(function() {
    db.run("CREATE TABLE if not exists user_info (name TEXT, pwhash TEXT)");
    var stmt = db.prepare("INSERT INTO user_info VALUES (?,?)");
    db.get("SELECT name, pwhash FROM user_info WHERE name = '" + login + "'", function(err, user) {
      if (err) throw err;
      console.log('user is: ', user);
      if (user) {
        context["heading"] = "This name is already known to us.";
      } else {
        stmt.run(login, pwhash);
        stmt.finalize();
        context["heading"] = "You are one of us now.";
        context["login"] = login;
        context["pw"] = pwhash;
      }
    });
  });

  db.close(function() {
    console.log('loading page');
    callback(response, tempPath, context);
  });
}

exports.register = registerNewUser;
