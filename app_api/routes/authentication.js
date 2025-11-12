/* ========================================================================================
  File: authentication.js
  Description: Route module for user authentication.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-11

  Purpose:
  - This file routes the process to the authentication controller in app_api directory.
  - Defines the endpoint `/register` and `/login` for user authentication.
  - Handles user registration and login requests.
=========================================================================================== */

// Import express module and create a router object
const express = require("express");
const router = express.Router();

// Import the authentication controller module
const authController = require("../controllers/authentication");

// Defines the endpoint `/register` and `/login` for user authentication.
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

// Export the router object to be used in other parts of the application
module.exports = router;