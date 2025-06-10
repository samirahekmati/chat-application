// Before a WebSocket connection can be made, you have to have a HTTP web-server that can handle the HTTP upgrade handshake process.
const http = require('http');
const websockets = require('ws')

//create http server obsect
http.createServer((req,res) =>{
  res.write('Hello world')

  res.end();
}).listen(3000)


