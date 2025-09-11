// This is the controller module to add navigation functionality for the index page.
// Controllers should manage the application logic

const fs = require('fs');
// Read the trips from the trips.json file @app_server.data and store data as trips.
const index_data = JSON.parse(fs.readFileSync('./data/index.json', 'utf8'));

/*GET Homepage view*/
const index = (req, res) => {
    // render the "index.js" page from the views upon router request
    // res.render is the Express function for compiling a view template to send as 
    // the HTML response that the browser will receive
    res.render('index', {title: "Travlr Getaways", currentPage: '/', content: index_data});
};

module.exports = {
    index
}