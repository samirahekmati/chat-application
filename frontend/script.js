const form = document.getElementById("chat-form");
const nameInput = document.getElementById("username-input");
const messageInput = document.getElementById("message-input");
const chatBox = document.getElementById("chat-box");
const validation = document.getElementById("validation");

// On page load: fetches and displays all messages
function loadMessages() {
  fetch("http://localhost:3000/messages")
    .then((res) => res.json)
    .then((data) => {
      chatBox.innerHTML = "";
      data.forEach((message) => {
        const messageElement = document.createElement("p");
        messageElement.style.border = "1px #ccc solid";
        messageElement.style.padding = "0.5rem";
        messageElement.textContent = `${message.userName}: ${message.message}`;
        chatBox.appendChild(messageElement);
      });
    });
}

form.addEventListener("submit", function (event) {
  event.preventDefault(); // <-- IMPORTANT! Stop the form from reloading the page

  const userName = nameInput.value.trim();
  console.log("user name-->", userName);

  const message = messageInput.value.trim();
  console.log("message-->", message);

  if (!message || !userName) {
    validation.textContent = "Please enter both a username and a message.";
    return; // stop the fetch if validation fails
  }

});


window.addEventListener('DOMContentLoaded', loadMessages);