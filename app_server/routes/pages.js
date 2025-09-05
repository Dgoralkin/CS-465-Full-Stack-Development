// Routing should map URL requests to controllers

const express = require('express');
const router = express.Router();

// Where the router looks for the URLs:
const controller = require('../controllers/pages');

/* GET travel page. */
router.get('/travel', controller.travel);

/* GET about page. */
router.get('/about', controller.about); 

/* GET contact page. */
router.get('/contact', controller.contact);

/* GET meals page. */
router.get('/meals', controller.meals);

/* GET news page. */
router.get('/news', controller.news);

/* GET rooms page. */
router.get('/rooms', controller.rooms);

module.exports = router;
