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

// Check if any field in the form is empty
function formIsValid(formElement) {
  const inputs = formElement.querySelectorAll("input");

  // Loop through all the input fields.
  for (const input of inputs) {
    if (input.value.trim() === "") {
      return {
        valid: false,
        message: `Field "${input.id}" is required.`,
        field: input.id
      };
    }
  }

  return { valid: true };
}

// Display an error — replace this later with your UI preferred method
function displayError(msg) {
  console.error(msg);
  alert(msg); // temporary until you add UI elements
}

// Show or hide password in the forms
function showPassword() {
  // Login form
  const loginPassword = document.getElementById("loginPassword");
  loginPassword.type = this.checked ? "text" : "password";
  // Register form
  const regPass = document.getElementById("regPass");
  regPass.type = this.checked ? "text" : "password";
  regPass
}

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

// Make a call to /api/login and sign in a user if user is registered.
async function loginUser(loginForm) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Include user details in the body as a JSON object.
      body: JSON.stringify(loginForm)
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

// =========================================================
// LOGIN FORM HANDLER:
// Validates all fields are filled and prepares JSON object.
// =========================================================

// Prevent default form submission and validate form input.
async function handleLogin(event) {

  event.preventDefault();
  const form = document.getElementById("loginForm");

  // Check that all fields are valid.
  const emptyCheck = formIsValid(form);
  if (!emptyCheck.valid) {
    displayError(emptyCheck.message);
    return response;
  }

  // Fetch and trim all input values in a JSON object
  const loginForm = {
    email: document.getElementById("loginEmail").value.trim(),
    password: document.getElementById("loginPassword").value.trim(),
  };
  console.log("Login form:", { loginForm });

  // Send login request /api/login carrying a body message to sign in existing user..
  const response = await loginUser(loginForm);

  // Return back to the login page if couldn't sign in user because he doesn't exist or password doesn't match.
  if (!response.ok) { return response; }

  // Account created successfully. Activate Online one-time password generator.
  console.log("IMPLEMENT: Returned to handleLogin() from loginUser()");
}


// =========================
// REGISTER FORM HANDLER
// =========================

// Prevent default form submission and validate form input.
async function handleRegister(event) {

  event.preventDefault();
  const form = document.getElementById("registerForm");

  // Check that all fields are valid.
  const emptyCheck = formIsValid(form);
  if (!emptyCheck.valid) {
    displayError(emptyCheck.message);
    return;
  }

  // Check passwords match or return with an alert message.
  const password1 = document.getElementById("regPass").value.trim();
  const password2 = document.getElementById("regConfirm").value.trim();

  if (password1 !== password2) {
    displayError("Passwords do not match.");
    return;
  }

  // Get unique user ID and user status by checking if session/cookie exist.
  const res = await fetch("/api/checkSession");
  const data = await res.json();
  const user_id = data.session.user_id;
  const isRegistered = data.session.isRegistered;

  // Fetch and trim all input values in a JSON object
  const registerForm = {
    user_id: user_id,                       // user registered as a guest
    fName: document.getElementById("firstName").value.trim(),
    lName: document.getElementById("lastName").value.trim(),
    email: document.getElementById("regEmail").value.trim(),
    password: document.getElementById("regPass").value.trim(),
    isRegistered: isRegistered,                    // new unregistered user
    isAdmin: false                          // user role
  };
  // console.log("Register form:", registerForm);

  // Send register request /api/register carrying a body message to create a new user account.
  const response = await registerNewUser(registerForm);

  // Return back to the login page if couldn't add new user and create new registered account.
  if (!response.ok) { return response; }

  // Account created successfully. Activate Online one-time password generator.
  console.log("IMPLEMENT: Online one-time password generator / TOTP");

}


// =========================
// Attach event listeners to fetch form data.
// =========================

document.getElementById("loginForm").addEventListener("submit", handleLogin);             // Submit login form
document.getElementById("registerForm").addEventListener("submit", handleRegister);       // Submit register form
document.getElementById("showPassword").addEventListener("change", showPassword);         // Hide/unhide password