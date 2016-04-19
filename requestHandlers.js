var querystring = require("querystring"),
  fs = require('fs'),
  Handlebars = require('handlebars'),
  root = __dirname;

function start(response, postData) {
  console.log("Request handler 'start' was called.");

  fs.readFile(root + '/templates/body.hbs', 'utf8', (err, data) => {
    if (err) throw err;
    response.writeHead(200, {"Content-Type": "text/html"});

    var template = Handlebars.compile(data);
    var context = {title: "My New Post", posted: postData};
    var html = template(context);

    response.write(html);
    response.end();
    // console.log(data);

  });

}

function upload(response, postData){
  console.log("Request handler 'upload' was called.");
  // response.writeHead(200, {"Content-Type": "text/plain"});
  // response.write("You've sent the text: "+ querystring.parse(postData).text);
  // response.end();
  start(response,querystring.parse(postData).text);

}

//this is server side resource loading handling (not tied to a url)
function loadResource(response,path,head){
  fs.readFile(root + path, 'utf8', (err, data) => {
    if (err) throw err;
    response.writeHead(200, {"Content-Type": head});
    response.write(data);
    response.end();
    //console.log(data);
  });
}

exports.start = start;
exports.upload = upload;
exports.loadResource = loadResource;
