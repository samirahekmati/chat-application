import express from "express";
import path from "path"; //used to serve static files
import { fileURLToPath } from 'url';

const app = express()

// __dirname is not available by default in ES module scope.
// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from "frontend" directory
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

app.get('/', (req,res) =>{
    res.sendFile(path.join(frontendPath, 'index.html'))
})


app.listen(3000, ()=>{
    console.log('server is listening on port 3000')
})