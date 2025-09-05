// This is the controller module to add navigation functionality for the travel page.
// Controllers should manage the application logic

/*GET travel view*/
const about = (req, res) => {
    // render the "about.js" page from the views upon router request
    // res.render is the Express function for compiling a view template to send as 
    // the HTML response that the browser will receive
    res.render('about', {title: "Travlr Getaways"});
};

module.exports = {
    about
}