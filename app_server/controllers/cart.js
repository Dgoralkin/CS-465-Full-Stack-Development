/* ========================================================================================
  File: cart.js
  Description: Controller module for the Shopping Cart page.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-13

  Purpose:
    - This is the controller module to add navigation functionality for the travel 
      page which manage the application logic
    - Fetch data from the database @travlr.cart collection through an API endpoint with a fallback option.
    - Render the cart view with the fetched data or show an enpty cart page if no data is found.
=========================================================================================== */

// Build an API URL from envirable variable (fallback to localhost) and the /api path.
const apiHost = process.env.API_HOST || "http://localhost:3000";
const CartEndpoint = `${apiHost}/api/cart`;

const options = {
    method: "GET",
    headers: {Accept: "application/json"}
}

// Controller function to handle requests to the travel page
const showCart = async function (req, res, next) {
    // console.log('showCart CONTROLLER BEGIN');

    // Make a GET request to the API endpoint to fetch trips
    await fetch(CartEndpoint, options)
    .then((res) => res.json())
    .then(json => {
        let message = null;
        console.log("API response received:", json);

        // Handle cases where no trips are found or unexpected data is returned
        if (!(json.length)) {
            message = "No trips were found in the database.";
            console.log(message);
        }
        console.log(json);

        // Render the cart page view with the fetched items in the cart and any message (Response 200 OK)
        res.render(
            'cart', {
                title: "Shopping Cart - Travlr Getaways", 
                currentPage: 'cart', 
                cartItems: json, 
                message
            });
    })

    // Catch and handle any errors that occur during the fetch operation
    .catch((err) => res.status(500).send(err.message));
};

module.exports = {
    showCart
}