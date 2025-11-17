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

// Attach event listeners to all forms with the class 'add-to-cart-form'
document.querySelectorAll('.add-to-cart-form').forEach(form => {

    // Event listener listening to the 'submit' button
    form.addEventListener('submit', async e => {

        // Prevent the default form submission behavior to handle it via JavaScript and stay on the page
        e.preventDefault();

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
            // Send a POST request to the server to add the trip to the cart
            const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },

            // Include the collection and trip ID in the request body
            body: JSON.stringify({
                collection: collection, 
                itemId: itemId, 
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
            button.style.left = '265px';
            button.style.backgroundColor = 'var(--secondary-color)';
        }
        });
});