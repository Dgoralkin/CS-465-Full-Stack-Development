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

// Import the Mongoose models for Cart, Travel, Rooms, and Meals collection
const DB_Cart = require('../models/cartSchema');
const DB_Travel = require('../models/tripsSchema');
const DB_Rooms = require('../models/roomsSchema');
const DB_Meals = require('../models/mealsSchema');

// Import the Mongoose model
const mongoose = require("mongoose");

// ======================================== //
//          *** Methods for GET ***         //
// ======================================== //

// GET: /cart -> Endpoint lists all trips from DB.cart collection.
// List all the existing items in user's personal cart.
// Returns JSON array of all existing objects in the cart.
const allCartItemsList = async (req, res) => {
    try {
        // Query the DB with get all items from the cart
        const query = await DB_Cart.find({}).exec();

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

// Function queries the database to find any single object from a given collection
// Returns JSON object of a single item found from any desired collection in the database.
// The query is built dynamically by the passed parameters through the URI. 
// E.g., /cart/colname/itemID123 where 'colname' is the collection name, and 'itemID123' is the item _id.
const findOneCartItem = async (req, res) => {
    try {
        // Read parameters from the URI and extract the collection name and item unique _id to query the database.
        const { dbCollection, itemId } = req.params;
        // console.log("dbCollection, itemId:", dbCollection, itemId);

        // Select the correct DB model dynamically by the parameters from URI
        let DB = null;
        if (dbCollection === "travel") DB = DB_Travel;
        else if (dbCollection === "rooms") DB = DB_Rooms;
        else if (dbCollection === "meals") DB = DB_Meals;

        // Handle case where requested collection is invalid
        if (!DB) {
        return res.status(400).json({ message: `Invalid collection name: ${dbCollection}` });
        }
        
        // Check if Object's _Id is valid and is exactly 24 characters long
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ message: `Invalid ObjectId: ${itemId}` });
        }

        // Query selected DB collection with get one to query the specific item by _id.
        const query = await DB.findOne({'_id' : itemId}).exec();

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

// ======================================== //
//          *** Methods for POST ***        //
// ======================================== //

const addItemToCart = async (req, res) => {

    try {
        // Extract passed object parameters from the message body request.
        const {collection, itemId, itemCode, itemName, itemRate, itemImage} = req.body;
        // console.log(collection, itemId, itemCode, itemName, itemRate, itemImage);

        // Create a new trip object using the data from req.body
        const newCartItem = new DB_Cart({
            _id: itemId,
            code: itemCode,
            name: itemName,
            dbCollection: collection,
            rate: itemRate,
            image: itemImage
    });

    // Save the new trip to the cart collection in the DB
    const q = await newCartItem.save();

    // Return the newly added trip name
    return res.status(201).json({ message: `Item ${itemName} added to your cart` });

    } catch {
        console.error("Error adding item to cart.");
        return res.status(400).json({ message: "Error adding trips to db."});
    }
};


// Export the controller methods
module.exports = {
    allCartItemsList,           // GET method
    findOneCartItem,            // GET method
    addItemToCart               // POST method
};