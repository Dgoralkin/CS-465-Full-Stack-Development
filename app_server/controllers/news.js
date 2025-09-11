// This is the controller module to add navigation functionality for the travel page and manage the application logic.
// res.render is the Express function for compiling a view template to send as the HTML response that the browser will receive

const fs = require('fs');
// Read the trips from the trips.json file @app_server.data and store data as trips.
const news_data = JSON.parse(fs.readFileSync('./data/news.json', 'utf8'));

/*GET news view*/
const news = (req, res) => {
    res.render('news', {title: "News - Travlr Getaways", currentPage: 'news', news_data});
};

module.exports = {
    news
}