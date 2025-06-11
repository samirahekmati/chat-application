// Before a WebSocket connection can be made, we have create a HTTP web-server that can handle the HTTP upgrade handshake process.
const http = require("http");
const fs = require("fs");
const path = require("path");
const db = require("./db");

const clients = []; // keep track of all the currently connected WebSocket clients.

// Step 1: create a HTTP server:
const http_server = http.createServer((req, res) => {
  const basePath = path.join(__dirname, "../frontend");
  const filePath = path.join(basePath, req.url === "/" ? "index.html" : req.url);
  const ext = path.extname(filePath);
  const contentTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
  };

  console.log('Requested URL:', req.url);
console.log('Serving file:', filePath);
  const contentType = contentTypes[ext] || "text/plain";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("404 Not Found");
    } else {
      res.writeHead(200, {
        "Content-Type": contentType,
        "access-control-allow-origin": "*", // Header allows any origin to access a web resource. It's a way to bypass the same-origin policy, enabling a web page to request resources from a different domain. This header is commonly used in web development for cross-origin resource sharing (CORS) scenarios
      });
      res.end(data);
    }
  });
});

// Start http server listening on port 8080
http_server.listen(8080, () => {
  console.log("The HTTP server is listening on port 8080");
});

// Step 2 create a Websocket server and attach it to the HTTP server
const websocketServer = require("websocket").server;
const websocket = new websocketServer({
  httpServer: http_server,
  autoAcceptConnections: false, //you must call req.accept() manually to complete the handshake,or req.reject() to deny it.
});

websocket.on('request', (request) => {
  // Accept the connection
  const connection = request.accept(null, request.origin);

  // Add connection to clients array
  clients.push(connection);
  console.log('New client connected, total clients:', clients.length);

  // Handle incoming messages from this client
  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      console.log('Received Message:', message.utf8Data);

      // Here, you can save the message to SQLite (db) and broadcast to all clients:
      const chatMessage = message.utf8Data;

      // Broadcast to all connected clients
      clients.forEach(client => {
        client.sendUTF(chatMessage);
      });

      // TODO: Save to db 
    }
  });

  // Handle client disconnect
  connection.on('close', (reasonCode, description) => {
    // Remove client from clients array
    const index = clients.indexOf(connection);
    if (index !== -1) clients.splice(index, 1);

    console.log('Client disconnected, total clients:', clients.length);
  });
});