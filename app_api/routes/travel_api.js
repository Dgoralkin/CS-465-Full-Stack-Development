// This file routes the process to the travel.js controller in app_api

const express = require("express");
const router = express.Router();

// Define the path for the travel page api
const tripsController = require("../controllers/travel_api");

// Defines the endpoint `/travel` and pass the content to the 'tripsController.tripsList' function.
router.route("/travel").get(tripsController.allTripsList);

// Defines the endpoint `/travel/:tripCode` and pass the content to the 'tripsController.findTrip' function.
router.route("/travel/:tripCode").get(tripsController.findTrip);

module.exports = router;