import express from "express";
import path from "path"; // to serve static files
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();

// Middleware
app.use(cors()); // Allow all origins (ok for local dev); so frontend can access it
app.use(express.json()); //to parse JSON request bodies



app.get("/", (req, res, next) => {
  res.send("<h1>Chat Backend with Long-polling is running.</h1>");
  console.log("Backend is running!");
});

// __dirname is not available by default in ES module scope.
// Recreate __dirname in ES module

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from "frontend" directory
// __dirname is The directory server.js is in
//'..'	Go up to the parent folder
const frontendPath = path.join(__dirname, "..", "frontend");

app.use(express.static(frontendPath));

app.get("/index", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
  console.log("index page running");
});

app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
