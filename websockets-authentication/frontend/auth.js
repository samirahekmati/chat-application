const backendURL = "https://n0co04s04kw48cwgcccccs00.hosting.codeyourfuture.io/api/auth";

// Handle Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${backendURL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("loginMessage").textContent = "Login successful!";
      // Save to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to chat
      window.location.href = "chat.html";
    } else {
      document.getElementById("loginMessage").textContent = data.message || "Login failed";
    }
  } catch (err) {
    document.getElementById("loginMessage").textContent = "Something went wrong";
  }
 
});

// Handle Register
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  try {
    const res = await fetch(`${backendURL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("registerMessage").textContent = "Registration successful!";
      // Clear the input fields
      document.getElementById('register-username').value = "";
      document.getElementById("registerEmail").value = "";
      document.getElementById("registerPassword").value = "";
    } else {
      document.getElementById("registerMessage").textContent = data.message || "Registration failed";
    }
  } catch (err) {
    document.getElementById("registerMessage").textContent = "Something went wrong";
  }
});