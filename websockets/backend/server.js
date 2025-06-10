// Before a WebSocket connection can be made, we have create a HTTP web-server that can handle the HTTP upgrade handshake process.
const http = require("http");

// Step 1: create a HTTP server:
const http_server = http.createServer((req, res) => {
  res.writeHead(200, {
    "access-control-allow-origin": "*", // Header allows any origin to access a web resource. It's a way to bypass the same-origin policy, enabling a web page to request resources from a different domain. This header is commonly used in web development for cross-origin resource sharing (CORS) scenarios
  });

  res.end("HTTP is running");
});

// Start http server listening on port 8080
http_server.listen(8080, () => {
  console.log("The HTTP server is listening on port 8080");
});

// Step 2 create a Websocket server and attach it to the HTTP server
const wbesocketServer = require('websocket').server;
const websocket = new wbesocketServer({
  httpServer: http_server,
  autoAcceptConnections: false //you must call req.accept() manually to complete the handshake,or req.reject() to deny it.
})
