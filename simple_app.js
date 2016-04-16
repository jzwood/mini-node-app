var http = require('http');
var sha1 = require('sha1');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8080);

console.log('Server running on port 8080.');
