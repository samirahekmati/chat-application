import express from "express";
import path from "path"; // to serve static files
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();

app.use(cors()); // Allow all origins (ok for local dev); so frontend can access it
app.use(express.json()); //to parse JSON request bodies

// In-memory message store
const messages = [];

// __dirname is not available by default in ES module scope.
// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from "frontend" directory
const frontendPath = path.join(__dirname, "..", "frontend");

app.post("/messages", (req, res) =>{
    const {userName , message} = req.body;
    console.log("recieved post request");

    if (!userName || !message) {
        return res.status(400).json({ error: 'Username and message are required.' });
      }
    
      const newMessage = { userName, message };
      messages.push(newMessage);
      console.log("new messages appears in the  old messages",messages)
    
      res.status(201).json({ success: true, message: 'Message added.' });
    
})

app.get("/messages", (req, res) =>{
    console.log("recieved a request for messages");
    res.json(messages);

})


app.get("/", (req, res, next) => {
  res.send("<h1>Backend is running.</h1>");
  console.log("Backend is running!");
});


app.use(express.static(frontendPath));
app.get("/index", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
  console.log("index page running");
});

app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
