/* ====================================================================
  File: travel.js
  Description: Client-side JavaScript for managing the travel cart.
  Author: Daniel Gorelkin
  Version: 1.0
  Created: 2025-11-13
  Updated: NA

  Purpose:
    - This file contains JavaScript code that runs in the browser to handle 
        adding selected items to the shopping cart.
    - It listens for form submissions on "Add to Cart" buttons, sends POST 
        requests to the server, and provides user feedback based on the server's response.
    - The code ensures a smooth user experience by disabling buttons during 
        processing and handling errors gracefully.
===================================================================== */

// Creates a new user account for guest user via the /api/guest endpoint
// Retrieves a signed JWT and stores it and the guest user _id 
// in the localStorage to start session.
async function isGuestUser() {

    // Create a new user account for guest user via the /api/guest endpoint.
    // Get session a JWT and store it in the localStorage to start session.
    try {
        const res = await fetch("/api/guest", {
            method: "POST",
            headers: { "Content-type": "application/json" }
        });

        const response = await res.json();
        // console.log("In isGuestUser, no token was found: user account created:", response);

        // Save token and guest user _id in localStorage.
        localStorage.setItem("token", response.token);
        localStorage.setItem("user_id", response.guestUser._id);

        // Set cookie to pass parameters to the server side controllers.
        const guestId = response.guestUser._id;
        document.cookie = `user_id=${guestId}; path=/; SameSite=Lax`;
        console.log("cookie:", document.cookie);

        // Return guest user id
        return response.guestUser._id
        
    } catch (err) {
        // Display error message.
        console.error('Error creating guest user account!', err);
    }
    return null;
}

// Attach event listeners to all forms with the class 'add-to-cart-form'
document.querySelectorAll('.add-to-cart-form').forEach(form => {

    // Event listener listening to the 'submit' button
    form.addEventListener('submit', async e => {

        // Prevent the default form submission behavior to handle it via JavaScript and stay on the page
        e.preventDefault();

        // Check if user is registered via the session token
        // If no user account exist, register user as a guest and set a session token in the localStorage.
        if (!localStorage.token) {
            const guestUser_id = await isGuestUser();
            console.log("User account created -> guestUser_id:", guestUser_id, "\nlocalStorage.token:", localStorage.token);
        } else {
            console.log("User account exist -> user_id:", localStorage.user_id, "\nlocalStorage.token:", localStorage.token);
        }

        // Get user id from the session data.
        const user_id = localStorage.user_id

        // Extract the item ID, code, name, and the DB.collection from the form's data attributes
        const itemId = form.querySelector('input[name="_id"]').value;
        const itemCode = form.querySelector('input[name="itemCode"]').value;
        const itemName = form.querySelector('input[name="itemName"]').value;
        const itemRate = form.querySelector('input[name="itemRate"]').value;
        const itemImage = form.querySelector('input[name="itemImage"]').value;
        const collection = form.querySelector('input[name="collection"]').value;
        
        // console.log('Adding to cart... ',itemCode, itemName, collection, itemId);

        // Select the button within the form to provide feedback
         const button = form.querySelector('button[type="submit"]');

        // Disable the button and change its text to indicate processing to prevent multiple submissions
        button.disabled = true;
        button.textContent = 'Adding...';

        try {
            // Send a POST request to the server to add the item to the cart
            const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },

            // Include the collection and trip ID in the request body
            body: JSON.stringify({
                user_id: user_id,
                collection: collection, 
                item_id: itemId, 
                itemCode: itemCode, 
                itemName: itemName,
                itemRate: itemRate,
                itemImage: itemImage,
                })
            });

            // Read response from the controller and display a confirmation message
            const result = await response.json();
            window.alert(result.message || 'Added to cart!');

        } catch (err) {
            // Display error message.
            console.error('Error adding to cart:', err);
            window.alert('Can\'t add this item to your cart.');

        } finally {
            // Enable the button back and change its text and texture
            // Use the Icon font from Bootstrap library 
            button.disabled = false;
            button.innerHTML = '<i class="bi bi-bag-check"></i> Already in cart!';
            button.style.left = '240px';
            button.style.backgroundColor = 'var(--secondary-color)';
        }
        });
});