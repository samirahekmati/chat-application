const form = document.getElementById("chat-form");
const nameInput = document.getElementById("username-input");
const messageInput = document.getElementById("message-input");
const chatBox = document.getElementById("chat-box");


// Add an event listener to the form element that triggers when the form is submitted
form.addEventListener("submit", (event) =>{

    // Prevent the default form submission behavior (which reloads the page)
    event.preventDefault();
    
    // Define the WebSocket server URL (in this case, it's a local server on port 3000)
    const url = "ws://localhost:3000"

    // Create a new WebSocket connection using the specified URL
    const ws = new WebSocket(url)
    console.log(ws)
})