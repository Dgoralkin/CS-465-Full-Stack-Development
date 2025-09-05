// Routing should map URL requests to controllers

const express = require('express');
const router = express.Router();
// Where the router looks for the URL:
const controller = require('../controllers/about');

/* GET travel page. */
router.get('/', controller.about);

module.exports = router;
