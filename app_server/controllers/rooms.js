// This is the controller module to add navigation functionality for the travel page and manage the application logic.
// res.render is the Express function for compiling a view template to send as the HTML response that the browser will receive

const fs = require('fs');
// Read the trips from the trips.json file @app_server.data and store data as trips.
const rooms_data = JSON.parse(fs.readFileSync('./data/rooms.json', 'utf8'));

/*GET rooms view*/
const rooms = (req, res) => {
    res.render('rooms', {title: "Rooms - Travlr Getaways", currentPage: 'rooms', rooms_data});
};

module.exports = {
    rooms
}