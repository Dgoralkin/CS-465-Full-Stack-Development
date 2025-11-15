/* ====================================================================
  File: cartPricing.js
  Description: Client-side JavaScript for managing the travel cart.
  Author: Daniel Gorelkin
  Version: 1.0
  Created: 2025-11-13
  Updated: NA

FIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIXMEFIX


  Purpose:
    - This file contains JavaScript code that runs in the browser to handle 
        adding selected items to the shopping cart.
    - It listens for form submissions on "Add to Cart" buttons, sends POST 
        requests to the server, and provides user feedback based on the server's response.
    - The code ensures a smooth user experience by disabling buttons during 
        processing and handling errors gracefully.
===================================================================== */

// Get all the buttons by class from the Cart page.
const quantityButtons = document.querySelectorAll('.btn-quantity');
// console.log("quantityButtons:", quantityButtons);

// Get all the attributes for each button.
quantityButtons.forEach(button => {

  // Add asynchronous event listener for each clicked button.
  button.addEventListener('click', async (e) => {
    // console.log("e.target:", e.target);

    // Get the id of the clicked button from its data-id.
    const btn = e.currentTarget;
    const itemID = btn.dataset.id;
    // console.log("btn, itemID:", btn, itemID);

    // Extract the text from the class which button was clicked.
    // Returns the item's quantity current value as a string and convert it to int.
    const clickedItem = document.querySelector(`.item-quantity[data-id="${itemID}"]`);
    let itemQuantity = parseInt(clickedItem.textContent);

    // Update the item's quantity value by one upon each clicked button.
    try {
      if (btn.matches('.btn-quantity.decrease')) {            // Decrease button clicked
        itemQuantity -= 1;
      } else if (btn.matches('.btn-quantity.increase')) {     // Increase button clicked
        itemQuantity += 1;
      }

      // Push the update to database through the defined API PUT request and a body message.
      const updateResponse = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ _id: itemID, quantity: itemQuantity })
      });

      // Also update item's quantity value in the HTML page if the database has been updated successfully.
      if (updateResponse.ok) {
        clickedItem.textContent = itemQuantity;
      }

      // Remove item from the cart upon clicked delete button.
      if (btn.matches('.btn-quantity.remove')) { 
        // Submit the delete command to database through the defined API DELETE request and a body message.
        const deleteResponse = await fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ _id: itemID })
        });

        // console.log("deleteResponse:", deleteResponse);

        // Also update item's quantity value in the HTML page if the database has been updated successfully.
        if (deleteResponse.ok) {
          // refresh the current page, so any updated data will be re-fetched from the server.
          location.reload();
        }
      }

    } catch (err) {
      console.log(`Error updating item ${itemID} in Cart:`, err);
    }

  });
});