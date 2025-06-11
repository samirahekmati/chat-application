const ws = new WebSocket("ws://localhost:8080/");

ws.onopen = () => console.log("WebSocket connected");
ws.onerror = (err) => console.error("WebSocket error:", err);
ws.onclose = () => console.log("WebSocket disconnected");

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const chatForm = document.getElementById("chat-form");
  const usernameInput = document.getElementById("username-input");
  const messageInput = document.getElementById("message-input");

  // Display received messages
  ws.onmessage = (event) => {
    const message = event.data;
    const messageElem = document.createElement("p");
    messageElem.textContent = message;
    chatBox.appendChild(messageElem);
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