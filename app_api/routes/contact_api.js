// This file routes the process to the rooms_api.js controller in app_api

const express = require("express");
const router = express.Router();

// Define the path for the contact us page api
const contactController = require("../controllers/contact_api");

// Defines the endpoint '/contact' and pass the content to the 'contactController.allRoomsList' function.
router.route("/contact").get(contactController.getContactUsForm);

module.exports = router;