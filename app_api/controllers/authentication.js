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
    - Supports authenticating and setting token for both guest and regular website users.
    - 
=========================================================================================== */

// Import required modules
// Methods to set JWT, register and validate user password
const jwt = require("jsonwebtoken");
const User = require("../models/user");
// Import the Mongoose models for Cart, Travel, Rooms, and Meals collection
const DB_Cart = require('../models/cartSchema');
const DB_User = require('../models/user');

// ======================================== //
//       *** Authentication Methods ***     //
// ======================================== //

// Register new user controller
// Validates user input, creates user, hashes password, and returns JWT.
const register = async (req, res) => {

    // Validate required user fields received from the form, else return error message
    // Reads the passed body message for: first name, email, and password.
    if (!req.body.fName || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: "All fields required" });
    }

    // Create new user object from User model schema. Data fetched from request body.
    try {
        const user = new User({
            fName: req.body.fName,                  // first name
            lName: req.body.lName,                  // last name
            email: req.body.email,                  // email
            isRegistered: req.body.isRegistered,    // guest or registered user
            isAdmin: req.body.isAdmin               // admin or user role
        });
        // console.log("inside register, user:", user);

        // Salt and hash the password using setPassword method from User model
        user.setPassword(req.body.password);

        // Try to add user to the database.users collection while checking if a user 
        // with the same email already exist. Return a 409 error and a confirmation message
        // to acknowledge user.
        try {
            await user.save();
        } catch (err) {
            // Duplicate email handling case. A user with the existing email already exist in the database.
            if (err.code === 11000) {
                return res.status(409).json({
                    message: "A user with this email already exists."
                });
            }
        }
        
        // =================================================================================
        // in generateJWT: Todo: update cookie, set new token
        // In DB: 
        // 1. update all cart items with the new user_id
        // 2. Set new token and update session
        // 3. Set new cookie
        const guestUser_id = req.body.user_id;
        const newUser_id = user._id;
        const isRegistered = req.body.isRegistered;
        console.log("isRegistered", isRegistered);
        if (guestUser_id && !isRegistered) {
            console.log("inside register, guestUser_id:", guestUser_id, "\nTODO: 1. update all cart items with the new user_id");

            try {
                // Update all guest records in the cart by updating then with the registered user id.
                const updatedCartItems = await DB_Cart.updateMany(
                    { user_id: guestUser_id },        // find guest's cart items
                    { $set: { user_id: newUser_id }}  // assign to new user
                );
                console.log("updatedCartItems: ", updatedCartItems);

            } catch (err) {
                console.error("Update cart owner error:", err);
                return res.status(500).json({ message: "Failed to update cart owner." });
            }
        }
        // =================================================================================


        // Generate and return unique token for the user.
        const token = user.generateJWT();
        // console.log("token: ", token);

        // Update cookie -> build session object for a cookie. Mark user as Register, and not Authenticated.
        const session = {
            token,
            user_id: newUser_id,
            isRegistered: true,
            isAuthenticated: false
        };

        // Store session in secure HttpOnly cookie
        res.cookie("sessionData", JSON.stringify(session), {
            httpOnly: true,                  // Browser JS cannot read it
            secure: true,                    // true if using HTTPS
            sameSite: "Lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 1  // expires 1 days
        });

        // Remove guest user from database
        if (guestUser_id && !isRegistered) {
            // Delete guestUser_id from database as all his cart items were migrated to newUser_id.
            const removeGuestUser = await DB_User.findOneAndDelete({ _id: guestUser_id }).exec();
            // console.log("removeGuestUser:", removeGuestUser);
        }

        // Return and proceed to login or to the second verification step.
        return res.status(200).json({ token, message: `Welcome ${user.fName} ${user.lName}!
            \n You will be redirected to set up a Two Step Verification login!` });

    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({
            message: "Failed to register user."
        });
    }
};


// Login existing user controller
// Validates user credentials and returns JWT if successful.
const login = async (req, res) => {
    // Check that all fields are in place, else return error message
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "All fields required" });
    }

    try {
        // Query the database for the user by email to validate credentials
        const user = await User.findOne({ email: req.body.email });

        // Check credentials and validate password (returns True if Hash matches)
        if (!user || !user.validPassword(req.body.password)) {
            // No Hash matched -> invalid credentials, return to login page.
            return res.status(401).json({ message: "Invalid credentials. Check your password or register!" });
        }

        // Generate a JSON Web Token for the user for 1H if valid credentials and return it
        const token = user.generateJWT();
        console.log("Username: ", req.body.email, "authenticated :-)");
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
// Return the new guest user object and the signed JWT + cookie
const registerGuest = async (req, res) => {
    
    try {
        // Create new user object from User model
        const guestUser = new User();
        // console.log("guestUser:", guestUser);

        // Save the guest user to the database
        await guestUser.save();

        // Generate a unique token for guest User.
        const token = guestUser.generateJWT();
        
        // Build session object for a cookie
        const session = {
            token,
            user_id: guestUser._id,
            isRegistered: false,
            isAuthenticated: false
        };

        // Store session in secure HttpOnly cookie
        res.cookie("sessionData", JSON.stringify(session), {
            httpOnly: true,                  // Browser JS cannot read it
            secure: true,                    // true if using HTTPS
            sameSite: "Lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 1  // expires 1 days
        });

        // Return user and token to the frontend if needed
         return res.status(200).json({ guestUser });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Defines the endpoint 'api/checkSession' for client checking if a session exist.
// Returns JSON with session details or response error.
const checkSession = async (req, res) => {
    try {
        // Read cookie data.
        const cookie = req.cookies.sessionData;

        // No cookie found, return session false.
        if (!cookie) {
            return res.status(200).json({
                hasSession: false,
                session: {
                user_id: "",
                isRegistered: false,
                isAuthenticated: false
            }
            });
        }

        // Parse cookie
        let session = JSON.parse(cookie);
        // console.log("session:", session);

        // Return a safe subset (without the token)
        return res.status(200).json({
            hasSession: true,
            session: {
                user_id: session.user_id,
                isRegistered: session.isRegistered,
                isAuthenticated: session.isAuthenticated
            }
        });

    } catch (err) {
        console.error("Error retrieving session:", err);
        return res.status(500).json({ 
            hasSession: false,
            message: "Error retrieving session",
            error: err 
        });
    }
};

// Export the controller methods
module.exports = {
    register,
    login,
    authenticateJWT,
    registerGuest,
    checkSession
};
