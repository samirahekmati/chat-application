const form = document.getElementById("chat-form");
const nameInput = document.getElementById("username-input");
const messageInput = document.getElementById("message-input");
const chatBox = document.getElementById("chat-box");
const validation = document.getElementById("validation");



// Append a single message to the chat box
function appendMessage(message) {
  const messageElement = document.createElement("p");
  messageElement.style.border = "1px #ccc solid";
  messageElement.style.padding = "0.5rem";
  messageElement.textContent = `${message.userName}: ${message.message}`;
  chatBox.appendChild(messageElement);
}

// Long-polling function
function startLongPolling() {
  fetch("http://localhost:3000/messages")
    .then((res) => res.json())
    .then((data) => {
      data.forEach(appendMessage);
      // After handling current messages, poll again
      startLongPolling();
    })
    .catch((err) => {
      console.error("Polling error:", err);
      // Retry after a short delay in case of network error
      setTimeout(startLongPolling, 2000);
    });
}

// Submit message
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const userName = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!message || !userName) {
    validation.textContent = "Please enter both a username and a message.";
    return;
  }

  validation.textContent = ""; // Clear error

  const newMessage = { userName, message };

  fetch("http://localhost:3000/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newMessage),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to send message");
      messageInput.value = ""; // Clear input
    })
    .catch((err) => console.error("Error sending message:", err));
});

// Start long-polling after page loads
window.addEventListener("DOMContentLoaded", startLongPolling);