const form = document.getElementById("chat-form");
const nameInput = document.getElementById("username-input");
const messageInput = document.getElementById("message-input");
const chatBox = document.getElementById("chat-box");
const validation = document.getElementById("validation");

let lastSeenIndex = 0;

function pollForNewMessages() {
  fetch(`http://localhost:3000/messages?lastSeen=${lastSeenIndex}`)
    .then(res => res.json())
    .then(newMessages => {
      newMessages.forEach(msg => {
        const messageElement = document.createElement("p");
        messageElement.style.border = "1px #ccc solid";
        messageElement.style.padding = "0.5rem";
        messageElement.textContent = `${msg.userName}: ${msg.message}`;
        chatBox.appendChild(messageElement);
      });

      lastSeenIndex += newMessages.length;

      pollForNewMessages(); // Keep polling
    })
    .catch(err => {
      console.error("Polling error:", err);
      setTimeout(pollForNewMessages, 3000); // Retry after 3s if failed
    });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const userName = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!userName || !message) {
    validation.textContent = "Please enter both a username and a message.";
    return;
  }

  validation.textContent = "";

  const newMessage = { userName, message };

  fetch('http://localhost:3000/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newMessage)
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to send message');
      messageInput.value = ''; // Clear input
    })
    .catch(err => console.error('Error sending message:', err));
});

window.addEventListener('DOMContentLoaded', pollForNewMessages);