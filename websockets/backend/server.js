const express = require("express");
const http = require("http");
const path = require("path");
const corsMiddleware = require("./middlewares/cors");
const { saveMessage, getAllMessages } = require("./db");
const websocketServer = require("websocket").server;

const app = express();

// Before a WebSocket connection can be made, we have create a HTTP web-server that can handle the HTTP upgrade handshake process.
const http_server = http.createServer(app);

// Apply CORS
app.use(corsMiddleware);

// Parse JSON requests
app.use(express.json());

// Serve static frontend files
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Route: Root
app.get("/", (req, res) => {
  res.send("Hello from Express backend!");
});

// Route: Example /messages (replace with DB logic later)
app.get("/messages", async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Start http server listening on port 8080
http_server.listen(8080, () => {
  console.log("The HTTP server is listening on port 8080");
});

// Step 2 create a Websocket server and attach it to the HTTP server
const websocket = new websocketServer({
  httpServer: http_server,
  autoAcceptConnections: false, //you must call req.accept() manually to complete the handshake,or req.reject() to deny it.
});

const clients = []; // keep track of all the currently connected WebSocket clients.

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
