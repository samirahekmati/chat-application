const ws = new WebSocket("ws://localhost:8080/");

// Function to fetch chat history from backend
async function loadChatHistory() {
    try {
      const response = await fetch('/messages');
      if (!response.ok) throw new Error('Network response was not ok');
  
      const messages = await response.json();
  
      const chatBox = document.getElementById('chat-box'); // your chat container element
  
      // Clear chat box first
      chatBox.innerHTML = '';
  
      // Display all messages
      messages.forEach(({ username, message, timestamp }) => {
        const msgElement = document.createElement('p');
        msgElement.textContent = `[${new Date(timestamp).toLocaleTimeString()}] ${username}: ${message}`;
        chatBox.appendChild(msgElement);
      });
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }
  
  // Call it once page loads
  window.addEventListener('load', () => {
    loadChatHistory();
  });


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