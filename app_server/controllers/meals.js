// This is the controller module to add navigation functionality for the travel page and manage the application logic.
// res.render is the Express function for compiling a view template to send as the HTML response that the browser will receive

const fs = require('fs');
// Read the trips from the trips.json file @app_server.data and store data as trips.
const meals_data = JSON.parse(fs.readFileSync('./data/meals.json', 'utf8'));

/*GET meals view*/
const meals = (req, res) => {
    res.render('meals', {title: "Meals - Travlr Getaways", currentPage: 'meals', meals_data});
};

module.exports = {
    meals
}