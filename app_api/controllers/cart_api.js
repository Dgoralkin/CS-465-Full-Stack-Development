/* ========================================================================================
  File: cart_api.js
  Description: Controller for travel-related API endpoints.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This file contains controller methods for handling API requests related to the travel collection.
    - It includes methods for retrieving, adding, and updating trips in the travel collection.
    - Each method interacts with the Mongoose model to perform database operations.
    - Proper error handling and response formatting are implemented.
=========================================================================================== */

// Import the Mongoose model for index collection
const DB_Travel = require('../models/tripsSchema');

// ======================================== //
//          *** Methods for GET ***         //
// ======================================== //

// GET: / -> Endpoint lists all trips from DB.travel collection.
// Returns JSON array of all trips.
const allCartItemsList = async (req, res) => {
    try {
        // Query the DB with get all items from the cart
        const query = await DB_Travel.find({}).exec();

        // If no results found, still return 200 but with a response message
        if (!query || query.length === 0) {
            return res.status(200).json({ message: "No results found" });
        }
        // Otherwise, return 200 OK and a json result
        return res.status(200).json(query);

    } catch (err) {
        console.error("Error retrieving trips:", err);
        return res.status(404).json({ message: "Server error", error: err });
    }
};

// GET: /trip:tripCode -> Endpoint lists a single trip from DB.trips collection.
// Returns JSON object of a single trip.
const updateCartItem = async (req, res) => {
    try {
        // Query the DB with get one
        // 'tripCode' is passed as a route parameter
        // E.g., /travel/ABC123 where 'ABC123' is the tripCode.
        const query = await DB_Travel.findOne({'_id' : req.params._id}).exec();

        // If no results found, still return 200 but with a response message
        if (!query || query.length === 0) {
            return res.status(200).json({ message: "No results found" });
        }
        // Otherwise, return 200 OK and a json result
        return res.status(200).json(query);

    } catch (err) {
        console.error("Error retrieving trips:", err);
        return res.status(404).json({ message: "Server error", error: err });
    }
};


// Export the controller methods
module.exports = {
    allCartItemsList,       // GET method
    updateCartItem,           // GET method
};