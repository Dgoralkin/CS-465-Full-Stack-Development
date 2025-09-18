// This is the controller module to add navigation functionality for the travel page and manage the application logic.
// res.render is the Express function for compiling a view template to send as the HTML response that the browser will receive

// Option 1: Read the trips from the trips.json file @app_server.data and store data as trips.
// Fetch trips data from the database through an API endpoint.
// Create a variable for our API endpoint
const tripsEndpoint = "http://localhost:3000/api/travel";
const options = {
    method: "GET",
    headers: {Accept: "application/json"}
}

/*GET travel view*/
const travel = async function (req, res, next) {
    console.log('TRAVEL CONTROLLER BEGIN');

    // Wire up both the URL and Options
    await fetch(tripsEndpoint, options)
    .then((res) => res.json())
    .then(json => {
        let message = null;
        if (!(json instanceof Array)) {
            console.log("API lookup error");
            message = "API lookup error";
            json = [];
        } else {
            if (!(json.length)) {
                message = "No trips were found in out database.";
            }
        }
        // Render the "travel.js" page with data from the DB/trips.
        res.render('travel', {title: "Travel - Travlr Getaways", currentPage: 'travel', trips: json, message});
    })
    .catch((err) => res.status(500).send(err.message));
};

// Option 2: Read the trips from the trips.json file @app_server.data and store data as trips.
/*
const fs = require('fs');
const trips_data = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

// Render the "travel.js" page from the views upon router request
    // The 'currentPage' passes the page name to the controller to update the class style
    // GET rooms view:
    const rooms = (req, res) => {
        res.render('travel', {title: "Travel - Travlr Getaways", currentPage: 'travel', trips: trips_data});
    };
*/

module.exports = {
    travel
}