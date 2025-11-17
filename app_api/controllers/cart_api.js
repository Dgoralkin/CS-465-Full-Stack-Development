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

// GET: /cart -> Endpoint lists all various items from DB.cart collection.
// List all the existing items in user's personal cart.
// Returns JSON flatten array of all existing objects in the cart ordered by trip -> room -> meal.
// Expected response format: [{all Travel objects}, {all Room objects}, {all Meals objects}]
const allCartItemsList = async (req, res) => {
    try {

    // Query the DB with get all items from the cart aggregated by collection.
    const query = await DB_Cart.find({}).lean().exec();

    // Define the desired rendering order
    const order = {
    travel: 1,
    rooms: 2,
    meals: 3
    };

    // Sort the results with JavaScript with a Timsort hybrid sorting algorithm. (mix of Merge and Insertion Sort -> O(n log n))
    query.sort((a, b) => {
    return order[a.dbCollection] - order[b.dbCollection];
    });

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

// Function queries the database to add a single object from the cart collection
// Validates and returns a response message if item already exist in the cart.
// Returns JSON object of a single item found from the cart collection in the database.
// E.g., /cart where the parameters are passed through a x-www-form-urlencoded message.
const addItemToCart = async (req, res) => {

    try {
        // Extract passed object parameters from the message body request.
        const {collection, itemId, itemCode, itemName, itemRate, itemImage} = req.body;
        // console.log(collection, itemId, itemCode, itemName, itemRate, itemImage);

        // Check if the item already exists in the cart
        const existingItem = await DB_Cart.findOne({ _id: itemId }).exec();

        // If found, return an informative 200 OK response and a message
        if (existingItem) {
            return res.status(200).json({ message: `Item "${itemName}" is already in your cart.` });
        }

        // If item does not exist in the cart, create a new item object using the data passed from req.body
        const newCartItem = new DB_Cart({
            _id: itemId,
            code: itemCode,
            name: itemName,
            dbCollection: collection,
            rate: itemRate,
            image: itemImage
    });

    // Save the new item to the cart collection in the DB
    const q = await newCartItem.save();

    // Return the newly added trip name
    return res.status(201).json({ message: `Item ${itemName} added to your cart` });

    } catch {
        console.error("Error adding item to cart.");
        return res.status(400).json({ message: "Error adding trips to db."});
    }
};

// ======================================== //
//          *** Methods for PUT ***        //
// ======================================== //

// Function queries the database to update a single object from the cart collection
// Returns the updated JSON object of a single item from the cart collection in the database.
// E.g., /cart where the _id parameter and the new quantity value are passed through a x-www-form-urlencoded message.
const updateItemQuantity = async (req, res) => {

    try {
        // Find the item by item _id and update its quantity field according to the request in req.body
        // Returns a JSON of the freshly updated record
        const updatedItem = await DB_Cart.findOneAndUpdate(
            { _id : req.body._id }, 
            { quantity: req.body.quantity },
            { new: true, runValidators: true }  // Run validator to insure minimum quantity limit.
        ).exec();

        // Validate that the cart item has been updated with the requested value.
        if (updatedItem !== null) {
            // Return OK and the updated item JSON object
            return res.status(201).json(updatedItem);
        } else {
            // Return 404 and the JSON
            return res.status(404).json(updatedItem);
        }

    // General error handler.
    } catch {
        console.error("Error updating item in cart.");
        return res.status(400).json({ message: "Error updating item in cart."});
    }
};

// ======================================== //
//          *** Methods for DELETE ***      //
// ======================================== //

// Function queries the database to delete a single object from the cart collection
// Returns a JSON confirmation message of removing object from the cart collection in the database.
// E.g., /cart where the _id parameter value is passed through a x-www-form-urlencoded message.
const removeItemFromCart = async (req, res) => {
    try {
        // Find the item by item _id and delete it from the database according to the request in req.body
        // Returns a JSON of the successfully deleted record
        const removeItem = await DB_Cart.findByIdAndDelete({ _id : req.body._id }).exec();
        // console.log("removeItem:", removeItem);

        // Validate that the cart item has been removed.
        if (!removeItem) {

            // Return 404 and the JSON
            return res.status(404).json({ error: "Item not found" });
        } 

        // Return OK and the updated item JSON object
            return res.status(201).json({ message: "Item removed", removeItem });

    // General error handler.
    } catch {
        console.error("Error deleting item from cart.");
        return res.status(400).json({ message: "Error deleting item from cart."});
    }
};

// Export the controller methods
module.exports = {
    allCartItemsList,           // GET method
    findOneCartItem,            // GET method
    addItemToCart,              // POST method
    updateItemQuantity,          // PUT method
    removeItemFromCart          // DELETE method
};