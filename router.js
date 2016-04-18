var path = require('path');

extensions = {
    ".html" : "text/html",
    ".css" : "text/css",
    ".js" : "application/javascript",
    ".png" : "image/png",
    ".gif" : "image/gif",
    ".jpg" : "image/jpeg"
};

function route(handle, pathname, response, postData) {
  console.log("About to route a request for " + pathname, "extension:",path.extname(pathname));
  var head = extensions[path.extname(pathname)];
  if (typeof handle[pathname] === 'function'){
    handle[pathname](response, postData);
  }else if(head){
    handle["load-resource"](response,pathname, head);
  }else{
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found");
    response.end();
  }
}

exports.route = route;
