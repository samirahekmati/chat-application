const backendURL = "http://localhost:3000"; 
const socket = io(backendURL);

const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const messagesList = document.getElementById("messages");
const logoutBtn = document.getElementById("logoutBtn");

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

// Redirect if not logged in
if (!token || !user) {
  window.location.href = "index.html";
}

// Show a message
function addMessage(msg, isOwn) {
  const li = document.createElement("li");
  li.textContent = `${msg.username || "User"}: ${msg.text}`;
  if (isOwn) li.classList.add("own");
  messagesList.appendChild(li);
  messagesList.scrollTop = messagesList.scrollHeight;
}

// Load past messages on page load from REST API
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(`${backendURL}/api/messages`);
    if (!res.ok) throw new Error("Failed to fetch messages");
    const messages = await res.json();

    messages.forEach(msg => {
      addMessage(msg, msg.username === user.username);
    });
  } catch (err) {
    console.error("Could not load past messages:", err);
  }
});




// Handle incoming messages
socket.on("message", (msg) => {
  addMessage(msg, msg.username === user.username);
});

// Send message
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  const message = {
    username: user.username,
    text,
    token,
  };

  socket.emit("message", message);
  messageInput.value = "";
});

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
});