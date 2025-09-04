// This is the controller module to add navigation functionality for the travel page.

/*GET travel view*/
const travel = (req, res) => {
    res.render('travel', {title: "Travlr Getaways"});
};

module.exports = {
    travel
}