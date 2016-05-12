/*
this page is a black-box of sorts that `magically` loads hbs files as html
as well as loads page resources
*/

var Handlebars = require('handlebars'),
    fs = require('fs'),
    path = require('path'),
    root = __dirname,
    extensions = {
    ".html" : "text/html",
    ".css" : "text/css",
    ".js" : "application/javascript",
    ".png" : "image/png",
    ".gif" : "image/gif",
    ".jpg" : "image/jpeg"
  }

function loadHTML(response, relative_path, context){
  fs.readFile((root + '/../../..' + relative_path), 'utf8', function(err, data){
    if (err) throw err
    response.writeHead(200, {"Content-Type": "text/html"})

    var template = Handlebars.compile(data)

    var html = template(context)

    response.write(html)
    response.end()
  })
}

//this is server side resource loading handling (not tied to a url)
function loadResource(response,pathname){
  var head = extensions[path.extname(pathname)]
  if(head){
    fs.readFile((root + '/../..' + pathname), 'utf8', function(err, data){
      if (err) throw err
      response.writeHead(200, {"Content-Type": head})
      response.write(data)
      response.end()
    })
  }else{
    console.log("No request handler found for " + pathname)
    response.writeHead(404, {"Content-Type": "text/plain"})
    response.write("404 Not found")
    response.end()
  }
}


exports.loadHTML = loadHTML
exports.loadResource = loadResource
