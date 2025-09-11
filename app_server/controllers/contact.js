// This is the controller module to add navigation functionality for the travel page and manage the application logic.
// res.render is the Express function for compiling a view template to send as the HTML response that the browser will receive

const fs = require('fs');
// Read the trips from the trips.json file @app_server.data and store data as trips.
const contact_data = JSON.parse(fs.readFileSync('./data/contact.json', 'utf8'));

/*GET contact view*/
const contact = (req, res) => {
    res.render('contact', {title: "Contact Us - Travlr Getaways", currentPage: 'contact', contact_data});
};

module.exports = {
    contact
}