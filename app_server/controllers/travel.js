// This is the controller module to add navigation functionality for the travel page and manage the application logic.
// res.render is the Express function for compiling a view template to send as the HTML response that the browser will receive

const fs = require('fs');
// Read the trips from the trips.json file @app_server.data and store data as trips.
const trips_data = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

/*GET travel view*/
const travel = (req, res) => {
    // Render the "travel.js" page from the views upon router request
    // The 'currentPage' passes the page name to the controller to update the class style
    res.render('travel', {title: "Travel - Travlr Getaways", currentPage: 'travel', trips: trips_data});
};

module.exports = {
    travel
}