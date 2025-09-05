// This is the controller module to add navigation functionality for the travel page.
// Controllers should manage the application logic

// res.render is the Express function for compiling a view template to send as 
// the HTML response that the browser will receive

/*GET travel view*/
const travel = (req, res) => {
    // Render the "travel.js" page from the views upon router request
    // The 'currentPage' passes the page name to the controller to update the class style
    res.render('travel', {title: "Travel - Travlr Getaways", currentPage: 'travel'});
};

/*GET about view*/
const about = (req, res) => {
    res.render('about', {title: "About - Travlr Getaways", currentPage: 'about'});
};

/*GET contact view*/
const contact = (req, res) => {
    res.render('contact', {title: "Contact Us - Travlr Getaways", currentPage: 'contact'});
};

/*GET meals view*/
const meals = (req, res) => {
    res.render('meals', {title: "Meals - Travlr Getaways", currentPage: 'meals'});
};

/*GET news view*/
const news = (req, res) => {
    res.render('news', {title: "News - Travlr Getaways", currentPage: 'news'});
};

/*GET rooms view*/
const rooms = (req, res) => {
    res.render('rooms', {title: "Rooms - Travlr Getaways", currentPage: 'rooms'});
};

module.exports = {
    travel,
    about,
    contact,
    meals,
    news,
    rooms
}