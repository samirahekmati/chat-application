import express from "express";
import path from "path"; // to serve static files
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();

app.use(cors()); // Allow all origins (ok for local dev); so frontend can access it
app.use(express.json()); //to parse JSON request bodies



app.listen(3000, () => {
  console.log("server is listening on port 3000");
});