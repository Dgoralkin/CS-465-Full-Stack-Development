/* ========================================================================================
  File: twoFactorAuth.js
  Description: Controller for user Two-Factor authentication setup.
  Author: Daniel Gorelkin
  Version: 1.0
  Created: 2025-11-24
  Updated: 

  Purpose:
    - This is the controller for authenticating users with the second authentication layer.
    - Defines the API endpoint for setting up the Time-based One Time Password (TOTP) by Google.
    - Generates a base32 secret key to setup the 2FA.
    - Generates a unique QR code to render on the 2FA/setup page.
    - Sets a short term cookie to be parsed by the browser controller.
    - Returns a message, secret, and the QR code.
=========================================================================================== */

// Import required modules
// Methods to set 2FA, and validate users via TOTP
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

// Import the Mongoose models for the Cart and User collections in the database.
const DB_User = require('../models/user');


// Define the route for POST /api/auth/2fa/setup
// Setup the Two Factor Authentication
const setup2FA = async (req, res) => {
    try {
        // Get a unique user Id from the pre-set sessionData cookie.
        const cookie = req.cookies.sessionData;
        if (!cookie) {
            return res.status(401).json({ message: "No cookie exist" });
        }
        // Extract user_id from the cookie
        const session = JSON.parse(cookie);
        const user_id = session.user_id;

        // Look up user in the database.
        const user = await DB_User.findById(user_id);

        // Generate secret key for the TOTP authenticator
        const secret = speakeasy.generateSecret({
            name: `travlr-(${user.email})`,
            length: 32
        });

        // Update user schema and store the secret
        user.twoFactorSecret = secret.base32;
        await user.save();
        // console.log("user", user);

        // Generate the QR code
        const qrCode = await QRCode.toDataURL(secret.otpauth_url);
        
        // Set up short term cookie template.
        const session2FA = {
            token: session.token,
            message: "Scan QR code with Google Authenticator",
            qrCode: qrCode,             // The QR code image
            secret: secret.base32       // The TOTP secret
        }

        // Store 2FA session in secure HttpOnly cookie.
        // Define short term 60 seconds lond cookie for the authenticator.
        // Data from the cookie will be used in setup2FA browser controller to render data to HBS page.
        res.cookie("session2FA", JSON.stringify(session2FA), {
            httpOnly: true,                  // Browser JS cannot read it
            secure: true,                    // true if using HTTPS
            sameSite: "Lax",
            path: "/2fa/setup",
            maxAge: 1000 * 60  // expires 1 minute
        });

        // Return
        return res.status(200).json({
            token: session.token,
            message: "Scan QR code with Google Authenticator",
            qrCode: qrCode,             // The QR code image
            secret: secret.base32       // The TOTP secret
        });
    } catch (err) {
        res.status(500).json({ message: "Error creating 2FA setup" });
    }
};

const verify2FA = async (req, res) => {
    console.log("In verify2FA.............................");
    res.json({ message: "2FA successfully enabled" });
};


// Export the controller methods
module.exports = {
    setup2FA,
    verify2FA
};