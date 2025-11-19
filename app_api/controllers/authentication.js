/* ========================================================================================
  File: contact_api.js
  Description: Controller for user authentication and registration.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This is the controller for authenticating and registering users.
    - It includes methods for user registration, login, and JWT authentication middleware.
=========================================================================================== */

// Import required modules
// Methods to set JWT, register and validate user password
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ======================================== //
//       *** Authentication Methods ***     //
// ======================================== //

// Register new user controller
// Validates user input, creates user, hashes password, and returns JWT.
const register = async (req, res) => {

    // Validate all user fields exist else return error message
    if (!req.body.fName || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: "All fields required" });
    }

    try {
        // Create new user object from User model
        const user = new User({
            fName: req.body.fName,                  // Fetch username from request body
            lName: req.body.lName,                  // Fetch username from request body
            email: req.body.email,                  // Fetch password from request body
            isRegistered: req.body.isRegistered,
            isAdmin: req.body.isAdmin
        });

        // Salt and hash the password using setPassword method from user model
        user.setPassword(req.body.password);

        // Save the user to the database
        await user.save();
        // console.log("User: ", req.body.name, " added to database.");

        // Generate and return unique token for the user.
        const token = user.generateJWT();
        return res.status(200).json({ token });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


// Login existing user controller
// Validates user credentials and returns JWT if successful.
const login = async (req, res) => {
    // Check that all fields are in place, else return error message
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "All fields required" });    // Return error
    }

    try {
        // Query the database for the user by email to validate credentials
        const user = await User.findOne({ email: req.body.email });

        // Check credentials and validate password (returns True if Hash metches)
        if (!user || !user.validPassword(req.body.password)) {
            // No Hash metched - invalid credentials
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate a JSON Web Token for the user for 1H if valid credentials and return it
        const token = user.generateJWT();
        // console.log("Username: ", req.body.email, "authenticated :-)");
        return res.status(200).json({ token });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// JWT authentication middleware - sits between the client’s request and the route handler.
// Called by Express automatically before running the route logic where authentication is needed.
const authenticateJWT = (req, res, next) => {
    // console.log('In Middleware - authenticateJWT');

    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    // Check if the header is present, return 401 if missing
    if (!authHeader) {
        console.log('Not enough tokens in Auth Header.');
        return res.status(401).json({ message: "Missing Authorization header" });
    }

    // Extract (["Bearer", "eyJhbGciOiJIUzI1NiIs..."]) and store the token.
    const token = authHeader.split(" ")[1];

    // Verify the token is valid and up to date.
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        // Token is valid, store decoded user info in request object for use in next middleware/route
        req.user = decoded;
        next();
    });
};

// Creates a blank user account for guest users managed by unique user _id.
// Create a signed session token for the guest user to be stored in localStorage.
// Return the new guest user object and the signed token.
const registerGuest = async (req, res) => {
    
    try {
        // Create new user object from User model
        const guestUser = new User();

        // Save the guest user to the database
        await guestUser.save();

        // Generate a unique token for guest User.
        const token = guestUser.generateJWT();

        return res.status(200).json({ guestUser: guestUser, token });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Export the controller methods
module.exports = {
    register,
    login,
    authenticateJWT,
    registerGuest
};
