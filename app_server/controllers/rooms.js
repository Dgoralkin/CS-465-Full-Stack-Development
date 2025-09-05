// This is the controller module to add navigation functionality for the travel page.
// Controllers should manage the application logic

/*GET travel view*/
const rooms = (req, res) => {
    // render the "rooms.js" page from the views upon router request
    // res.render is the Express function for compiling a view template to send as 
    // the HTML response that the browser will receive
    res.render('rooms', {title: "Travlr Getaways"});
};

module.exports = {
    rooms
}