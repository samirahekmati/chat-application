const ws = new WebSocket("wss://wkgc4c00c8kwcocksok8gco0.hosting.codeyourfuture.io/");

// Function to fetch chat history from backend
async function loadChatHistory() {
  try {
    const response = await fetch("https://wkgc4c00c8kwcocksok8gco0.hosting.codeyourfuture.io/messages");
    if (!response.ok) throw new Error("Network response was not ok");

    const messages = await response.json();

    const chatBox = document.getElementById("chat-box"); // your chat container element

    // Clear chat box first
    chatBox.innerHTML = "";

    // Display all messages
    messages.forEach(({ username, msg, timestamp }) => {
      const messageElem = document.createElement("div");
      messageElem.className = "message-box";

      const textElem = document.createElement("p");
      textElem.textContent = `${username}: ${msg}`;

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

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const chatForm = document.getElementById("chat-form");
  const usernameInput = document.getElementById("username-input");
  const messageInput = document.getElementById("message-input");

  // Display received messages
  ws.onmessage = (event) => {
    const { username, msg, timestamp } = JSON.parse(event.data);

    const messageElem = document.createElement("div");
    messageElem.className = "message-box";

    const textElem = document.createElement("p");
    textElem.textContent = `${username}: ${msg}`;

    const timeElem = document.createElement("span");
    const date = new Date(timestamp);
    timeElem.textContent = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    timeElem.className = "timestamp";

    messageElem.appendChild(textElem);
    messageElem.appendChild(timeElem);

    document.getElementById("chat-box").appendChild(messageElem);
  };

  // Send message on form submit
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Submit handler called"); // for debugging
    const username = usernameInput.value.trim();
    const message = messageInput.value.trim();
    if (!username || !message) return;

    const fullMessage = `${username}: ${message}`;
    ws.send(fullMessage);

    messageInput.value = "";
  });
});
