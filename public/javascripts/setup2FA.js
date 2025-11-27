/* ====================================================================
  File: setup2FA.hbs
  Description: This is the combined, user side registration and login page logic.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-10

  Purpose:
    - Reads the input data from the submitted user authentication form.
    - Auto shifts the input boxes input mark in the authentication form and
      notifies user if submitted code is incorrect. (Code isn't verified)
    - Reads the input data from the user authentication form.
    - Calls verify2FA to authenticate provided code from user.
    - Redirects to the homepage id user verified.
===================================================================== */

// =================================================================================================
// Functions to validate form completeness and correctness to prevent incomplete URI form submission
// =================================================================================================

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

// Make a call to the server @ route /api/2fa/verify to verify the provided response code from user.
async function verify2FA(authCode) {
  try {
    const response = await fetch('/api/2fa/verify', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      // Include the provided authCode in the request body
      body: JSON.stringify({
        authCode: authCode,
      }) 
    });

    /*const authResponse = await response.json()
    console.log("response:", authResponse.message);*/

    return response;

  } catch (err) {
    console.log("TOTP 2FA verification error:", err);
    console.error("TOTP 2FA verification error:", err);
  }
  return false;
}


// Method reads response authentication code from the 2faForm form.
// Renders an error update in the form if authentication failed (auth code is incorrect).
// Redirects user to homepage if authentication succeeded.
async function handle2faAuth(e) {
  // Pause default execution
  e.preventDefault();

  try {
    // Read all six input digits from the submitted form and save them in ressCode.
    const ressInput = document.querySelectorAll(".totp-inputs input");
    let ressCode = "";
    ressInput.forEach(i => ressCode += i.value);
    // console.log("In handle2faAuth authCode received:", ressCode);

    // Contact the server controller to verify the code.
    const verified2FA = await verify2FA(ressCode);
    const data = await verified2FA.json();

    // If user authentication verified, log him in and redirect him to the homepage.
    if (verified2FA.ok) {

      // Update the view on the page.
      Object.assign(document.getElementById("2faForm_header_h1"), 
      { innerHTML: data.message.status, style: "color:black;" });

      // Greet and redirect to homepage rendering route.
      alert(`Welcome ${data.message.userFname} ${data.message.userLname}!`);
      window.location.href = "/";

    } else {
      // Display incorrect code message response via updated html.
      Object.assign(document.getElementById("2faForm_header_h1"), 
      { innerHTML: data.message, style: "color:red;" });
      // Mark all input boxes as red.
      ressInput.forEach(input => {
        input.style.color = "red";
        input.style.borderColor = "red";
      });
    };

  } catch (err) {
    console.log("Error in handle2faAuth:", err);
    console.error("Error in handle2faAuth:", err);
  }
}


// =============================================
// Event listeners to fetch authentication form.
// =============================================

// Listen to each digit input in the TOTP authentication form. 
// Shift the input marker to the next box, to the right.
document.querySelectorAll('.totp-inputs input').forEach((input, idx, arr) => {
  input.addEventListener('input', () => {
    if (input.value.length === 1 && idx < arr.length - 1) {
      arr[idx + 1].focus();
    }
  });

  // Shift the input marker to the previous box.
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !input.value && idx > 0) {
      arr[idx - 1].focus();
    }
  });
});

// Submit 2faForm form event listener to trigger the authentication verification.
document.getElementById("2faForm").addEventListener("submit", handle2faAuth);