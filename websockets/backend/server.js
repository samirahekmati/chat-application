// Before a WebSocket connection can be made, we have create a HTTP web-server that can handle the HTTP upgrade handshake process.
const http = require("http");
const fs = require("fs");
const path = require("path");
const db = require("./db");
const { saveMessage, getAllMessages } = require("./db");

const clients = []; // keep track of all the currently connected WebSocket clients.

// Step 1: create a HTTP server:
const http_server = http.createServer((req, res) => {
  // Set CORS headers for all responses:
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Handle preflight requests quickly
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello from backend root!");
    return;
  }

  // Serve chat history if endpoint is /messages
  if (req.method === "GET" && req.url === "/messages") {
    getAllMessages()
      .then((rows) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(rows));
      })
      .catch((err) => {
        res.writeHead(500);
        res.end("Error retrieving messages");
        console.error(err);
      });
    return; // Important: Stop here if /messages is handled
  }

  // Otherwise serve frontend files (HTML, CSS, JS)
  const basePath = path.join(__dirname, "../frontend");
  const filePath = path.join(
    basePath,
    req.url === "/" ? "index.html" : req.url
  );
  const ext = path.extname(filePath);
  const contentTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
  };

  const contentType = contentTypes[ext] || "text/plain";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("404 Not Found");
    } else {
      res.writeHead(200, {
        "Content-Type": contentType,
       // "access-control-allow-origin": "*", // Header allows any origin to access a web resource. It's a way to bypass the same-origin policy, enabling a web page to request resources from a different domain. This header is commonly used in web development for cross-origin resource sharing (CORS) scenarios
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

websocket.on("request", (request) => {
  // Accept the connection
  const connection = request.accept(null, request.origin);

  // Add connection to clients array
  clients.push(connection);
  console.log("New client connected, total clients:", clients.length);

  // Handle incoming messages from this client
  connection.on("message", (message) => {
    if (message.type === "utf8") {
      console.log("Received Message:", message.utf8Data);

      const text = message.utf8Data;
      const [username, msg] = text.split(":").map((str) => str.trim());
      const timestamp = new Date().toISOString();

      // Save to DB
      saveMessage(username, msg)
        .then(() => console.log("Message saved to DB"))
        .catch((err) => console.error("DB error:", err));

      // Create structured message
      const fullMessage = JSON.stringify({ username, msg, timestamp });
      // Broadcast to all connected clients
      clients.forEach((client) => {
        client.sendUTF(fullMessage);
      });
    }
  });

  // Handle client disconnect
  connection.on("close", (reasonCode, description) => {
    // Remove client from clients array
    const index = clients.indexOf(connection);
    if (index !== -1) clients.splice(index, 1);

    console.log("Client disconnected, total clients:", clients.length);
  });
});
