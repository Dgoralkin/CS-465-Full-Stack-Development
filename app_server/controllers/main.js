// This is the controller module to add navigation functionality for the index page.

/*GET Homepage*/
const index = (req, res) => {
    res.render('index', {title: "Travlr Getaways"});
};

module.exports = {
    index
}