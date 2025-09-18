// This file integrates with MongoDB to retrieve data for our application.

// Pull Model details from tripsSchema
const DB_Travel = require('../models/tripsSchema');

// ======================================== //
//          *** Methods for GET ***         //
//    Triggered by the travel_api router    //
// ======================================== //

// GET: /trip -> Endpoint lists all trips from DB.trips collection.
const allTripsList = async (req, res) => {
    try {
        // Query the DB with get all
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
const findTrip = async (req, res) => {
    try {
        // Query the DB with find one document by code pased through "/travel/:tripCode"
        // GET request for: http://localhost:3000/api/travel/DAWR210315
        const query = await DB_Travel.findOne({'code' : req.params.tripCode}).exec();

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


// Execute tripsList endpoints.
module.exports = {
    allTripsList,
    findTrip
};