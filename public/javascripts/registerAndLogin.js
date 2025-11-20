/* ====================================================================
  File: registerAndLogin.hbs
  Description: This is the user side combined registration and login page.
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


// =========================================================
// LOGIN FORM HANDLER:
// Validates all fields are filled and prepares JSON object.
// =========================================================

// Prevent default form submission and validate form input.
function handleLogin(event) {

  event.preventDefault();
  const form = document.getElementById("loginForm");

  // Check that all fields are valid.
  const emptyCheck = formIsValid(form);
  if (!emptyCheck.valid) {
    displayError(emptyCheck.message);
    return;
  }

  // Fetch and trim all input values in a JSON object
  const loginForm = {
    email: document.getElementById("loginEmail").value.trim(),
    password: document.getElementById("loginPassword").value.trim(),
  };
  console.log("Login form:", { loginForm });

  // TODO: Send login request to backend fetch(`/api/login`, {...})
}


// =========================
// REGISTER FORM HANDLER
// =========================

// Prevent default form submission and validate form input.
function handleRegister(event) {

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

  // Get unique user ID from the local storage if a token exist.
  const user_id = localStorage.getItem("user_id");

  // Fetch and trim all input values in a JSON object
  const registerForm = {
    user_id: user_id,
    fName: document.getElementById("firstName").value.trim(),
    lName: document.getElementById("lastName").value.trim(),
    email: document.getElementById("regEmail").value.trim(),
    password: document.getElementById("regPass").value.trim()
  };
  console.log("Register form:", registerForm);

  // TODO: Send register request fetch(`/api/register`, {...})
}


// =========================
// Attach event listeners to fetch form data.
// =========================

document.getElementById("loginForm").addEventListener("submit", handleLogin);             // Submit login form
document.getElementById("registerForm").addEventListener("submit", handleRegister);       // Submit register form
document.getElementById("showPassword").addEventListener("change", showPassword);         // Hide/unhide password
