// This is the controller module to add navigation functionality for the index page.
// Controllers should manage the application logic

/*GET Homepage view*/
const index = (req, res) => {
    // render the "index.js" page from the views upon router request
    // res.render is the Express function for compiling a view template to send as 
    // the HTML response that the browser will receive
    res.render('index', {title: "Travlr Getaways"});
};

module.exports = {
    index
}