/* ====================================================================
  File: registerAndLogin.hbs
  Description: This is the combined, user side registration and login page logic.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-10

  Purpose:
    - Used to register new "customer" users and add the created user account to the database.
    - The login method validated that all fields were entered and the username and password are correct.
    - Allows registered users to recover their forgotten password.
    - Uses Google's Two Factor Auth to authenticate users.
===================================================================== */

// =================================================================================================
// Functions to validate form completeness and correctness to prevent incomplete URI form submission
// =================================================================================================

/*

// Make a call to /api/register and register new user via the authenticator 
async function registerNewUser(registerForm) {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Include user details in the body as a JSON object.
      body: JSON.stringify(registerForm)
    });

    // Read response from the controller and display a confirmation message in a pop out window.
    // If server returned an error (status 409), means that a user with same email already exists in DB.
    // Display alert message to acknowledge user and return to login page.
    const result = await response.json();
    window.alert(result.message || 'Welcome!');
    return response;
  } 
  catch (err) {
    // Return a fake error-like response to avoid undefined
    console.error("Network or server error:", err);
    return { ok: false, status: 0, json: async () => ({ message: "Network error. Try again later." }) };
  }
}

// ===================================
// Event listeners to fetch form data.
// ===================================


document.getElementById("loginForm").addEventListener("submit", handleLogin);             // Submit login form
document.getElementById("registerForm").addEventListener("submit", handleRegister);       // Submit register form
document.getElementById("showPassword").addEventListener("change", showPassword);         // Hide/unhide password

// 
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      logoutUser();
    });
  }
});

*/