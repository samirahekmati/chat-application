// Initiate the WebSocket handshake immediately on script load so it connects as early as possible
//It connects the frontend to WebSocket backend over a secure wss:// connection.
//When successful, the onmessage handler becomes active and listens for real-time messages.
const ws = new WebSocket(
  "wss://lccw0gs4co800osk4s88s4k0.hosting.codeyourfuture.io/"
);

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const chatForm = document.getElementById("chat-form");
  const usernameInput = document.getElementById("username-input");
  const messageInput = document.getElementById("message-input");

  // Handling Real-Time Messages: handles what happens every time WebSocket receives a new message from the server.
  // Display received messages
  ws.onmessage = (event) => {
    //Converts the JSON string into a usable JavaScript object
    const { username, message, timestamp } = JSON.parse(event.data);

    const messageElem = document.createElement("div");
    messageElem.className = "message-box";

    const textElem = document.createElement("p");
    textElem.textContent = `${username}: ${message}`;

    const timeElem = document.createElement("span");
    const date = new Date(timestamp);
    timeElem.textContent = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    timeElem.className = "timestamp";

    messageElem.appendChild(textElem);
    messageElem.appendChild(timeElem);

    chatBox.appendChild(messageElem);
  };

  // Send message on form submit
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const message = messageInput.value.trim();
    if (!username || !message) return;

    const fullMessage = `${username}: ${message}`;
    // Send the message over the WebSocket to the backend
    ws.send(fullMessage);

    messageInput.value = "";
  });
});

// Function to fetch chat history from backend
async function loadChatHistory() {
  try {
    const response = await fetch(
      "https://lccw0gs4co800osk4s88s4k0.hosting.codeyourfuture.io/messages"
    );
    if (!response.ok) throw new Error("Network response was not ok");

    const messages = await response.json();

    const chatBox = document.getElementById("chat-box"); // your chat container element

    // Clear chat box first
    chatBox.innerHTML = "";

    // Display all messages
    messages.forEach(({ username, message, timestamp }) => {
      const messageElem = document.createElement("div");
      messageElem.className = "message-box";

      const textElem = document.createElement("p");
      textElem.textContent = `${username}: ${message}`;

      const timeElem = document.createElement("span");
      const date = new Date(timestamp);
      timeElem.textContent = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      timeElem.className = "timestamp";

      messageElem.appendChild(textElem);
      messageElem.appendChild(timeElem);

      chatBox.appendChild(messageElem);
    });
  } catch (error) {
    console.error("Failed to load chat history:", error);
  }
}

// Call it once page loads
window.addEventListener("load", () => {
  loadChatHistory();
});
