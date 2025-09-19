// This is the controller module to add navigation functionality for the travel page and manage the application logic.
// res.render is the Express function for compiling a view template to send as the HTML response that the browser will receive


// Create a variable for our API endpoint
const contactEndpoint = "http://localhost:3000/api/contact";
const options = {
  method: "GET",
  headers: { Accept: "application/json" }
};

/* GET contact view */
const getContactUs = async (req, res, next) => {
  console.log("CONTACT US CONTROLLER BEGIN");

  try {
    // Fetch results from the database (backend API URL)
    const response = await fetch(contactEndpoint, options);

    // Throw an error if the response has a bad status (404 or 500)
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    // Converts the API response into a JS object/array.
    let contactDetails = await response.json();
    // console.log(contactDetails);
    let message = null;

    if (!Array.isArray(contactDetails)) {
      console.error("API returned unexpected data");
      message = "API lookup error";
      contactDetails = [];
    } else if (contactDetails.length === 0) {
      message = "No trips were found in our database.";
    }

    // Response 200 OK, Render the "rooms.js" page with data from the DB.meal.
    res.render("contact", {
      title: "Contact Us - Travlr Getaways",
      currentPage: "contact",
      contact_data: contactDetails[0],
      message
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

module.exports = {
    getContactUs,
};
