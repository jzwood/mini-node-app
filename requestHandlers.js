var querystring = require("querystring");
var fs = require('fs');
var root = __dirname;

function start(response, postData) {
  console.log("Request handler 'start' was called.");

  fs.readFile(root + '/templates/body.html', 'utf8', (err, data) => {
    if (err) throw err;
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(data);
    response.end();
    console.log(data);

  });

  var body = '<html>'+
  '<head>'+
  '<meta http-equiv="Content-Type" content="text/html; '+
  'charset=UTF-8" />'+
  '</head>'+
  '<body>'+
  '<form action="/upload" method="post">'+
  '<textarea name="text" rows="20" cols="60"></textarea>'+
  '<input type="submit" value="Submit text" />'+
  '</form><p>'+ postData
  '</p></body>'+
  '</html>';

}

function upload(response, postData){
  console.log("Request handler 'upload' was called.");
  // response.writeHead(200, {"Content-Type": "text/plain"});
  // response.write("You've sent the text: "+ querystring.parse(postData).text);
  // response.end();
  start(response,querystring.parse(postData).text);

}

function loadResource(response,path,head){
  fs.readFile(root + path, 'utf8', (err, data) => {
    if (err) throw err;
    response.writeHead(200, {"Content-Type": head});
    response.write(data);
    response.end();
    console.log(data);
  });
}

exports.start = start;
exports.upload = upload;
exports.loadResource = loadResource;
