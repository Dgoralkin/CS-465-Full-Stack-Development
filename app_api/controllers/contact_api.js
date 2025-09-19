// This file integrates with MongoDB to retrieve data for our application.

// Pull Model details from tripsSchema
const DB_Contact = require('../models/contactSchema');

// ======================================== //
//          *** Methods for GET ***         //
//    Triggered by the contatc_api router   //
// ======================================== //

// GET: /contact -> Endpoint lists all rooms from DB.room collection.
const getContactUsForm = async (req, res) => {
    try {
        // Query the DB with get all
        const query = await DB_Contact.find({}).exec();

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

// Execute allRoomsList endpoints.
module.exports = {
    getContactUsForm,
};